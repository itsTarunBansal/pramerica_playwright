import { useState, useEffect, useRef } from "react";
import { useProject, NVEST_TENANT_ID } from "../context/ProjectContext";
import type { PramericaTestData } from "../types";
import { buildSteps } from "../services/playwrightSteps";
import { buildDynamicSteps } from "../services/dynamicSteps";
import { runTestCases, getFieldConfigs, createTestCase } from "../services/api";
import * as XLSX from "xlsx";
import "./TestCaseGeneratorPage.css";
const DEFAULT_ROW: PramericaTestData = {
  agentCode: "70016333", otp1: "1", otp2: "2", otp3: "3", otp4: "1", otp5: "2", otp6: "3", 
  proposerPAN: "LLLLL9999H", mobileNumber: "8888888888", sameProposer: "Yes", title: "MR",
  firstName: "Testing", middleName: "Testing", lastName: "Testing", gender: "Male",
  dateOfBirth: "22/10/1990", email: "test@pramericalife.in",
  address1: "gggui", address2: "gugiuhg", address3: "huhujh", landmark: "gugiuhgju",
  pinCode: "122018", state: "Haryana", city: "Adampur 1- Haryana",
  monthlyIncome: "1,00,0000", monthlyExpenses: "1,0000", maritalStatus: "married",
  premiumMode: "1", premiumChannel: "19", premiumFrequency: "1", planOption: "3", premiumAmount: "5,0000",
  policyTerm: "20", premiumPayingTerm: "9",
  education: "PGA", occupation: "SL", natureOfDuty: "MGCN",
  employerName: "", employerAddress: "", designation: "", annualIncome: "",
  spouseName: "", fatherName: "", motherName: "",
  nomineeRelation: "FTR", nomineeTitle: "DR", nomineeName: "", nomineeGender: "Male",
  nomineeSharePercentage: "100", nomineeDOB: "",
  bankAccountNumber: "", ifscCode: "",
  weightKgs: "", heightFeet: "5", heightInches: "6",
};

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// Per-row extra data for dynamic-only fields (not in PramericaTestData)
type DynamicExtras = Record<string, string>;

export default function TestCaseGeneratorPage({ tenantId, projectUrl: propProjectUrl, projectName }: { tenantId?: string; projectUrl?: string; projectName?: string }) {
  const { projectUrl: ctxProjectUrl } = useProject();
  const activeProjectUrl = propProjectUrl ?? ctxProjectUrl;
  const activeTenantId = tenantId || NVEST_TENANT_ID;
  const isDynamicProject = !!tenantId && tenantId !== NVEST_TENANT_ID;
  const displayName = projectName ?? (activeTenantId === NVEST_TENANT_ID ? "Nvest" : activeTenantId);
  const [rows, setRows] = useState<PramericaTestData[]>([]);
  const [dynamicExtras, setDynamicExtras] = useState<DynamicExtras[]>([]);
  const [count, setCount] = useState(1);
  const [running, setRunning] = useState(false);
  const [runStatus, setRunStatus] = useState<string | null>(null);
  const [lastRunId, setLastRunId] = useState<string | null>(null);
  const [fieldConfigs, setFieldConfigs] = useState<any[]>([]);
  const [useDynamicFields, setUseDynamicFields] = useState(isDynamicProject);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFieldConfigs();
  }, [activeTenantId]);

  useEffect(() => {
    // Initialize first row when field configs are loaded or when toggling dynamic fields
    if (fieldConfigs.length > 0) {
      if (rows.length === 0) {
        // Create initial row
        const initialRow = createRowWithDefaults();
        setRows([initialRow]);
      } else {
        // Apply default values to existing rows when field configs change or dynamic fields toggle
        setRows(prevRows => prevRows.map(row => {
          const updatedRow = { ...row };
          if (useDynamicFields) {
            fieldConfigs.forEach(config => {
              if (config.defaultValue && config.fieldName in updatedRow) {
                // Only apply default if field is empty or matches old default
                const currentValue = updatedRow[config.fieldName as keyof PramericaTestData];
                if (!currentValue || currentValue === DEFAULT_ROW[config.fieldName as keyof PramericaTestData]) {
                  (updatedRow as any)[config.fieldName] = config.defaultValue;
                }
              }
            });
          }
          return updatedRow;
        }));
      }
    }
  }, [fieldConfigs, useDynamicFields]);

  async function loadFieldConfigs() {
    try {
      const configs = await getFieldConfigs(activeTenantId);
      setFieldConfigs(configs);
    } catch (err: any) {
      console.error("Failed to load field configs:", err);
      setSaveStatus(`❌ Failed to load field configs: ${err.message}`);
    }
  }

  async function syncFieldsAndDefaults() {
    await loadFieldConfigs();
    applyDefaultsToAllRows();
  }

  // Check if a fieldName exists in PramericaTestData
  const isStaticField = (fieldName: string) => fieldName in DEFAULT_ROW;

  function getDynamicValue(rowIdx: number, fieldName: string): string {
    return dynamicExtras[rowIdx]?.[fieldName] ?? "";
  }

  function setDynamicValue(rowIdx: number, fieldName: string, value: string) {
    setDynamicExtras(prev => {
      const next = [...prev];
      next[rowIdx] = { ...(next[rowIdx] ?? {}), [fieldName]: value };
      return next;
    });
  }

  // Merge static row + dynamic extras into one object for step building
  function mergeRowData(rowIdx: number): any {
    return { ...rows[rowIdx], ...(dynamicExtras[rowIdx] ?? {}) };
  }

  function createRowWithDefaults() {
    const newRow = { ...DEFAULT_ROW };
    if (useDynamicFields && fieldConfigs.length > 0) {
      fieldConfigs.forEach(config => {
        if (config.defaultValue && config.fieldName in newRow) {
          (newRow as any)[config.fieldName] = config.defaultValue;
        }
      });
    }
    return newRow;
  }

  function applyDefaultsToAllRows() {
    setRows(prevRows => prevRows.map(row => {
      const updatedRow = { ...row };
      fieldConfigs.forEach(config => {
        if (config.defaultValue && config.fieldName in updatedRow) {
          (updatedRow as any)[config.fieldName] = config.defaultValue;
        }
      });
      return updatedRow;
    }));
  }

  async function saveTestCases() {
    setSaving(true);
    setSaveStatus(null);
    try {
      await Promise.all(
        rows.map((testData, i) =>
          createTestCase({
            name: `${testData.firstName || "Test"} ${testData.lastName || "Case"} - ${testData.agentCode}`,
            appUrl: activeProjectUrl,
            tenantId: activeTenantId,
            insuranceInput: { age: 0, sumInsured: 0, policyType: "term" },
            steps: useDynamicFields ? buildDynamicSteps(mergeRowData(i), fieldConfigs, activeProjectUrl) : buildSteps(testData, activeProjectUrl),
          })
        )
      );
      setSaveStatus(`✅ ${rows.length} test case(s) saved`);
    } catch (err: any) {
      setSaveStatus(`❌ Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function runTests() {
    setRunning(true);
    setRunStatus(null);
    try {
      const testCases = rows.map((testData, i) => ({
        testCaseId: i + 1,
        url: activeProjectUrl,
        steps: useDynamicFields ? buildDynamicSteps(mergeRowData(i), fieldConfigs, activeProjectUrl) : buildSteps(testData, activeProjectUrl),
        testData: mergeRowData(i),
      }));
      console.log("Generated test cases:", testCases);
      const { results, runId } = await runTestCases(testCases, activeTenantId);
      if (runId) setLastRunId(runId);
      // Build CSV/Excel content
      const header = "testCaseId,agentCode,proposerPAN,firstName,lastName,applicationNumber,status,error";
      const body = results.map(r =>
        `"${r.testCaseId}","${r.agentCode}","${r.proposerPAN}","${r.firstName}","${r.lastName}","${r.applicationNumber}","${r.status}","${r.error ?? ""}"`
      ).join("\n");
      downloadFile(`${header}\n${body}`, "application-numbers.csv", "text/csv");
      const passed = results.filter(r => r.status === "success").length;
      setRunStatus(`✅ ${passed}/${results.length} passed — Results downloaded`);
    } catch (err: any) {
      setRunStatus(`❌ ${err.message}`);
    } finally {
      setRunning(false);
    }

  }

  function addRows() {
    setRows(r => {
      const lastCode = parseInt(r[r.length - 1]?.agentCode || DEFAULT_ROW.agentCode);
      return [...r, ...Array.from({ length: count }, (_, i) => {
        const newRow = createRowWithDefaults();
        newRow.agentCode = String(lastCode + i + 1);
        return newRow;
      })];
    });
    setDynamicExtras(prev => [
      ...prev,
      ...Array.from({ length: count }, () => ({}))
    ]);
  }

  function updateCell(rowIdx: number, field: keyof PramericaTestData, value: string) {
    setRows(r => r.map((row, i) => i === rowIdx ? { ...row, [field]: value } : row));
  }

  function deleteRow(idx: number) {
    setRows(r => r.filter((_, i) => i !== idx));
    setDynamicExtras(prev => prev.filter((_, i) => i !== idx));
  }

  function getExcelFields(isDynamic: boolean, configs: any[]) {
    return isDynamic
      ? configs.filter(f => f.actionType === "fill" || f.actionType === "select").map(f => f.fieldName)
      : Object.keys(DEFAULT_ROW).filter(key => !key.startsWith("otp"));
  }

  function downloadExcelFormat() {
    if (useDynamicFields && fieldConfigs.length === 0) {
      setUploadStatus("⚠️ No field configurations loaded. Please Sync Fields first.");
      return;
    }
    const fields = getExcelFields(useDynamicFields, fieldConfigs);
    const sampleRow = fields.map(key => DEFAULT_ROW[key as keyof PramericaTestData] ?? "");
    const ws = XLSX.utils.aoa_to_sheet([fields, sampleRow]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Test Cases");
    XLSX.writeFile(wb, "test-cases-template.xlsx");
  }

  function handleExcelUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Snapshot state to avoid stale closure inside FileReader callback
    const isDynamic = useDynamicFields;
    const configs = fieldConfigs;
    const expectedFields = getExcelFields(isDynamic, configs);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData.length < 2) {
          setUploadStatus("❌ Excel file must contain headers and at least one data row");
          return;
        }

        const headers = jsonData[0] as string[];
        const dataRows = jsonData.slice(1).filter(row => row.some((cell: any) => cell !== undefined && cell !== ""));

        // Strict validation
        const missingFields = expectedFields.filter(f => !headers.includes(f));
        if (missingFields.length > 0) {
          setUploadStatus(`❌ Missing required fields: ${missingFields.join(", ")}`);
          return;
        }

        // Parse rows — empty cells fall back to DEFAULT_ROW value
        const newRows: PramericaTestData[] = dataRows.map(row => {
          const testCase = { ...DEFAULT_ROW };
          headers.forEach((header, idx) => {
            if (header in testCase) {
              const cellValue = String(row[idx] ?? "").trim();
              (testCase as any)[header] = cellValue !== ""
                ? cellValue
                : DEFAULT_ROW[header as keyof PramericaTestData] ?? "";
            }
          });
          return testCase;
        });

        setRows(newRows);
        setDynamicExtras(newRows.map(() => ({})));
        setExpandedCards(new Set());
        setExpandedSections(new Set());
        setUploadStatus(`✅ Successfully imported ${newRows.length} test case(s)`);
      } catch (err: any) {
        setUploadStatus(`❌ Failed to parse Excel file: ${err.message}`);
      }
    };
    reader.readAsArrayBuffer(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function updateOtp(rowIdx: number, otp: string) {
    const digits = otp.replace(/\D/g, "").slice(0, 6).split("");
    setRows(r => r.map((row, i) => i !== rowIdx ? row : {
      ...row,
      otp1: digits[0] ?? "", otp2: digits[1] ?? "", otp3: digits[2] ?? "",
      otp4: digits[3] ?? "", otp5: digits[4] ?? "", otp6: digits[5] ?? "",
    }));
  }

  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const getSections = (isDynamic: boolean) => isDynamic
    ? [...new Set(fieldConfigs.map(f => f.section))]
    : ["Login Details","Personal Information","Address","Financial Details","Policy Details","Occupation","Family Details","Nominee Details","Bank Details","Health Information"];

  const toggleCard = (idx: number) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const expandAllSections = (idx: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      getSections(useDynamicFields).forEach(s => next.add(`${idx}-${s}`));
      return next;
    });
  };

  const collapseAllSections = (idx: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      getSections(useDynamicFields).forEach(s => next.delete(`${idx}-${s}`));
      return next;
    });
  };

  const toggleSection = (cardIdx: number, section: string) => {
    const key = `${cardIdx}-${section}`;
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const isSec = (cardIdx: number, section: string) => expandedSections.has(`${cardIdx}-${section}`);

  const renderField = (i: number, field: string, label: string, config?: any) => {
    const row = rows[i];
    const isDynOnly = !isStaticField(field);
    const dynValue = isDynOnly ? getDynamicValue(i, field) : "";

    // Show skipped fields as disabled with tooltip
    if (config?.isSkipped) {
      return (
        <div className="field-group" key={field} title="Field marked as skipped">
          <label style={{ color: "#9ca3af" }}>
            {label} <span style={{ fontSize: "11px", background: "#fee2e2", color: "#ef4444", padding: "1px 6px", borderRadius: "4px", marginLeft: "4px" }}>⏭ Skipped</span>
          </label>
          <input disabled value="" placeholder="Field marked as skipped" style={{ background: "#f9fafb", color: "#9ca3af", cursor: "not-allowed" }} />
        </div>
      );
    }

    if (config) {
      if (config.inputType === "select" && config.selectOptions?.length > 0) {
        const val = isDynOnly
          ? (dynValue || config.defaultValue || "")
          : (row[field as keyof PramericaTestData] !== undefined && row[field as keyof PramericaTestData] !== "" ? row[field as keyof PramericaTestData] : config.defaultValue || "");
        return (
          <div className="field-group" key={field}>
            <label>{label}</label>
            <select
              value={val}
              onChange={e => isDynOnly ? setDynamicValue(i, field, e.target.value) : updateCell(i, field as keyof PramericaTestData, e.target.value)}
            >
              <option value="">Select...</option>
              {config.selectOptions.map((opt: string) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        );
      }
      const val = isDynOnly
        ? (dynValue || config.defaultValue || "")
        : (row[field as keyof PramericaTestData] !== undefined && row[field as keyof PramericaTestData] !== "" ? row[field as keyof PramericaTestData] : config.defaultValue || "");
      return (
        <div className="field-group" key={field}>
          <label>{label}</label>
          <input
            type={config.inputType === "number" ? "number" : "text"}
            value={val}
            onChange={e => isDynOnly ? setDynamicValue(i, field, e.target.value) : updateCell(i, field as keyof PramericaTestData, e.target.value)}
            placeholder={config.defaultValue ? `Default: ${config.defaultValue}` : ""}
          />
        </div>
      );
    }
    return (
      <div className="field-group">
        <label>{label}</label>
        {field === "title" ? (
          <select value={row[field as keyof PramericaTestData]} onChange={e => {
            const t = e.target.value;
            const gender = t === "MR" ? "Male" : "Female";
            setRows(r => r.map((row, ri) => ri === i ? { ...row, title: t, gender } : row));
          }}>
            <option value="MR">MR</option><option value="MRS">MRS</option><option value="MS">MS</option>
          </select>
        ) : field === "sameProposer" ? (
          <select value={row[field as keyof PramericaTestData]} onChange={e => updateCell(i, field as keyof PramericaTestData, e.target.value)}>
            <option value="Yes">Yes</option><option value="No">No</option>
          </select>
        ) : field === "maritalStatus" ? (
          <select value={row[field as keyof PramericaTestData]} onChange={e => updateCell(i, field as keyof PramericaTestData, e.target.value)}>
            <option value="married">Married</option><option value="single">Single</option>
          </select>
        ) : field === "premiumFrequency" ? (
          <select value={row[field as keyof PramericaTestData]} onChange={e => updateCell(i, field as keyof PramericaTestData, e.target.value)}>
            <option value="1">Annual</option><option value="2">Semi-Annual</option>
            <option value="3">Quarterly</option><option value="4">Monthly</option>
          </select>
        ) : field === "planOption" ? (
          <select value={row[field as keyof PramericaTestData]} onChange={e => updateCell(i, field as keyof PramericaTestData, e.target.value)}>
            <option value="3">Fortune Builder</option><option value="4">Dream Builder</option>
          </select>
        ) : (
          <input value={row[field as keyof PramericaTestData]} onChange={e => updateCell(i, field as keyof PramericaTestData, e.target.value)} />
        )}
      </div>
    );
  };

  return (
    <div className="test-generator">
      <div className="header">
        <h1>Test Case Generator — {displayName}</h1>
        <div className="actions">
          <label style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: "16px" }}>
            <input
              type="checkbox"
              checked={useDynamicFields}
              onChange={(e) => setUseDynamicFields(e.target.checked)}
            />
            Use Dynamic Fields ({fieldConfigs.length})
          </label>
          <button onClick={syncFieldsAndDefaults} className="btn-secondary" title="Refresh field configurations and apply defaults">
            🔄 Sync Fields
          </button>
          <div className="add-section">
            <input type="number" min={1} max={50} value={count} onChange={e => setCount(Number(e.target.value))} />
            <button onClick={addRows} className="btn-secondary">+ Add Test Cases</button>
          </div>
          <button onClick={saveTestCases} disabled={saving || rows.length === 0} className="btn-secondary">
            {saving ? "💾 Saving..." : "💾 Save Test Cases"}
          </button>
          <button onClick={runTests} disabled={running} className="btn-primary">
            {running ? "⏳ Running..." : "▶ Run Tests"}
          </button>
          <button onClick={downloadExcelFormat} className="btn-secondary">
            📥 Download Format
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="btn-secondary">
            📤 Upload Excel
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelUpload}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <div className="stats">
        {rows.length} test case(s) • {useDynamicFields ? `Dynamic (${fieldConfigs.length} fields)` : "Static"}
        {runStatus && <span className="status">{runStatus}</span>}
        {lastRunId && activeTenantId && (
          <a href={`/projects/${activeTenantId === NVEST_TENANT_ID ? "nvest" : activeTenantId}/api-logs`} className="status"
            style={{ color: "#2563eb", textDecoration: "underline", cursor: "pointer" }}>
            🌐 View API Logs
          </a>
        )}
        {saveStatus && <span className="status">{saveStatus}</span>}
        {uploadStatus && <span className="status">{uploadStatus}</span>}
        {!useDynamicFields && fieldConfigs.length > 0 && (
          <span style={{ color: "orange", marginLeft: "10px" }}>⚠️ Enable Dynamic Fields to use Field Manager configurations</span>
        )}
      </div>

      <div className="cards-container">
        {rows.map((row, i) => (
          <div key={i} className={`test-card ${expandedCards.has(i) ? 'expanded' : ''}`}>
            <div className="card-header" onClick={() => toggleCard(i)}>
              <div className="card-title">
                <span className="card-number">#{i + 1}</span>
                <span className="card-info">{row.firstName || "Test"} {row.lastName || "Case"} - {row.agentCode || "N/A"}</span>
              </div>
              <div className="card-actions">
                {expandedCards.has(i) && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); expandAllSections(i); }} className="btn-secondary" style={{ padding: "2px 8px", fontSize: "11px" }}>Expand All</button>
                    <button onClick={(e) => { e.stopPropagation(); collapseAllSections(i); }} className="btn-secondary" style={{ padding: "2px 8px", fontSize: "11px" }}>Collapse All</button>
                  </>
                )}
                <button onClick={(e) => { e.stopPropagation(); deleteRow(i); }} className="btn-delete">Delete</button>
                <span className="expand-icon">{expandedCards.has(i) ? '▼' : '▶'}</span>
              </div>
            </div>

            {expandedCards.has(i) && (
              <div className="card-body">
                {useDynamicFields ? (
                  // Dynamic fields from database
                  [...new Set(fieldConfigs.map(f => f.section))].map(section => (
                    <div key={section} className="section">
                      <h3 onClick={() => toggleSection(i, section)} style={{ cursor:"pointer", display:"flex", justifyContent:"space-between" }}>
                        {section} <span style={{ fontSize:"12px", color:"#6b7280" }}>{isSec(i, section) ? "▼" : "▶"}</span>
                      </h3>
                      {isSec(i, section) && <div className="fields-grid">
                        {fieldConfigs.filter(f => f.section === section).map(config => renderField(i, config.fieldName, config.label, config))}
                      </div>}
                    </div>
                  ))
                ) : (
                  // Static hardcoded fields
                  <>
                <div className="section">
                  <h3 onClick={() => toggleSection(i, "Login Details")} style={{ cursor:"pointer", display:"flex", justifyContent:"space-between" }}>Login Details <span style={{ fontSize:"12px", color:"#6b7280" }}>{isSec(i, "Login Details") ? "▼" : "▶"}</span></h3>
                  {isSec(i, "Login Details") && <div className="fields-grid">
                    {renderField(i, "agentCode", "Agent Code")}
                    <div className="field-group">
                      <label>OTP</label>
                      <input value={`${row.otp1}${row.otp2}${row.otp3}${row.otp4}${row.otp5}${row.otp6}`} onChange={e => updateOtp(i, e.target.value)} maxLength={6} placeholder="6-digit OTP" />
                    </div>
                  </div>}
                </div>

                <div className="section">
                  <h3 onClick={() => toggleSection(i, "Personal Information")} style={{ cursor:"pointer", display:"flex", justifyContent:"space-between" }}>Personal Information <span style={{ fontSize:"12px", color:"#6b7280" }}>{isSec(i, "Personal Information") ? "▼" : "▶"}</span></h3>
                  {isSec(i, "Personal Information") && <div className="fields-grid">
                    {renderField(i, "proposerPAN", "PAN")}
                    {renderField(i, "mobileNumber", "Mobile")}
                    {renderField(i, "sameProposer", "Same Proposer")}
                    {renderField(i, "title", "Title")}
                    {renderField(i, "firstName", "First Name")}
                    {renderField(i, "middleName", "Middle Name")}
                    {renderField(i, "lastName", "Last Name")}
                    {renderField(i, "gender", "Gender")}
                    {renderField(i, "dateOfBirth", "Date of Birth")}
                    {renderField(i, "email", "Email")}
                    {renderField(i, "maritalStatus", "Marital Status")}
                  </div>}
                </div>

                <div className="section">
                  <h3 onClick={() => toggleSection(i, "Address")} style={{ cursor:"pointer", display:"flex", justifyContent:"space-between" }}>Address <span style={{ fontSize:"12px", color:"#6b7280" }}>{isSec(i, "Address") ? "▼" : "▶"}</span></h3>
                  {isSec(i, "Address") && <div className="fields-grid">
                    {renderField(i, "address1", "Address Line 1")}
                    {renderField(i, "address2", "Address Line 2")}
                    {renderField(i, "address3", "Address Line 3")}
                    {renderField(i, "landmark", "Landmark")}
                    {renderField(i, "pinCode", "Pin Code")}
                    {renderField(i, "state", "State")}
                    {renderField(i, "city", "City")}
                  </div>}
                </div>

                <div className="section">
                  <h3 onClick={() => toggleSection(i, "Financial Details")} style={{ cursor:"pointer", display:"flex", justifyContent:"space-between" }}>Financial Details <span style={{ fontSize:"12px", color:"#6b7280" }}>{isSec(i, "Financial Details") ? "▼" : "▶"}</span></h3>
                  {isSec(i, "Financial Details") && <div className="fields-grid">
                    {renderField(i, "monthlyIncome", "Monthly Income")}
                    {renderField(i, "monthlyExpenses", "Monthly Expenses")}
                    {renderField(i, "annualIncome", "Annual Income")}
                  </div>}
                </div>

                <div className="section">
                  <h3 onClick={() => toggleSection(i, "Policy Details")} style={{ cursor:"pointer", display:"flex", justifyContent:"space-between" }}>Policy Details <span style={{ fontSize:"12px", color:"#6b7280" }}>{isSec(i, "Policy Details") ? "▼" : "▶"}</span></h3>
                  {isSec(i, "Policy Details") && <div className="fields-grid">
                    {renderField(i, "premiumMode", "Premium Mode")}
                    {renderField(i, "premiumChannel", "Premium Channel")}
                    {renderField(i, "premiumFrequency", "Premium Frequency")}
                    {renderField(i, "planOption", "Plan Option")}
                    {renderField(i, "premiumAmount", "Premium Amount")}
                    {renderField(i, "policyTerm", "Policy Term")}
                    {renderField(i, "premiumPayingTerm", "Premium Paying Term")}
                  </div>}
                </div>

                <div className="section">
                  <h3 onClick={() => toggleSection(i, "Occupation")} style={{ cursor:"pointer", display:"flex", justifyContent:"space-between" }}>Occupation <span style={{ fontSize:"12px", color:"#6b7280" }}>{isSec(i, "Occupation") ? "▼" : "▶"}</span></h3>
                  {isSec(i, "Occupation") && <div className="fields-grid">
                    {renderField(i, "education", "Education")}
                    {renderField(i, "occupation", "Occupation")}
                    {renderField(i, "natureOfDuty", "Nature of Duty")}
                    {renderField(i, "employerName", "Employer Name")}
                    {renderField(i, "employerAddress", "Employer Address")}
                    {renderField(i, "designation", "Designation")}
                  </div>}
                </div>

                <div className="section">
                  <h3 onClick={() => toggleSection(i, "Family Details")} style={{ cursor:"pointer", display:"flex", justifyContent:"space-between" }}>Family Details <span style={{ fontSize:"12px", color:"#6b7280" }}>{isSec(i, "Family Details") ? "▼" : "▶"}</span></h3>
                  {isSec(i, "Family Details") && <div className="fields-grid">
                    {renderField(i, "spouseName", "Spouse Name")}
                    {renderField(i, "fatherName", "Father Name")}
                    {renderField(i, "motherName", "Mother Name")}
                  </div>}
                </div>

                <div className="section">
                  <h3 onClick={() => toggleSection(i, "Nominee Details")} style={{ cursor:"pointer", display:"flex", justifyContent:"space-between" }}>Nominee Details <span style={{ fontSize:"12px", color:"#6b7280" }}>{isSec(i, "Nominee Details") ? "▼" : "▶"}</span></h3>
                  {isSec(i, "Nominee Details") && <div className="fields-grid">
                    {renderField(i, "nomineeRelation", "Relation")}
                    {renderField(i, "nomineeTitle", "Title")}
                    {renderField(i, "nomineeName", "Name")}
                    {renderField(i, "nomineeGender", "Gender")}
                    {renderField(i, "nomineeSharePercentage", "Share %")}
                    {renderField(i, "nomineeDOB", "Date of Birth")}
                  </div>}
                </div>

                <div className="section">
                  <h3 onClick={() => toggleSection(i, "Bank Details")} style={{ cursor:"pointer", display:"flex", justifyContent:"space-between" }}>Bank Details <span style={{ fontSize:"12px", color:"#6b7280" }}>{isSec(i, "Bank Details") ? "▼" : "▶"}</span></h3>
                  {isSec(i, "Bank Details") && <div className="fields-grid">
                    {renderField(i, "bankAccountNumber", "Account Number")}
                    {renderField(i, "ifscCode", "IFSC Code")}
                  </div>}
                </div>

                <div className="section">
                  <h3 onClick={() => toggleSection(i, "Health Information")} style={{ cursor:"pointer", display:"flex", justifyContent:"space-between" }}>Health Information <span style={{ fontSize:"12px", color:"#6b7280" }}>{isSec(i, "Health Information") ? "▼" : "▶"}</span></h3>
                  {isSec(i, "Health Information") && <div className="fields-grid">
                    {renderField(i, "weightKgs", "Weight (kg)")}
                    {renderField(i, "heightFeet", "Height (feet)")}
                    {renderField(i, "heightInches", "Height (inches)")}
                  </div>}
                </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
