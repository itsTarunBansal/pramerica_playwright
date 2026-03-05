import { useState, useEffect } from "react";
import type { PramericaTestData } from "../types";
import { buildSteps } from "../services/playwrightSteps";
import { buildDynamicSteps } from "../services/dynamicSteps";
import { runTestCases, getFieldConfigs, createTestCase } from "../services/api";
import "./TestCaseGeneratorPage.css";

const CSV_HEADERS: (keyof PramericaTestData)[] = [
  "agentCode","otp1","otp2","otp3","otp4","otp5","otp6", 
  "proposerPAN","mobileNumber","sameProposer","title","firstName","middleName","lastName","gender",
  "dateOfBirth","email","address1","address2","address3","landmark",
  "pinCode","state","city","monthlyIncome","monthlyExpenses","maritalStatus",
  "premiumMode","premiumChannel","premiumFrequency","planOption","premiumAmount",
  "policyTerm","premiumPayingTerm","education","occupation","natureOfDuty",
  "employerName","employerAddress","designation","annualIncome",
  "spouseName","fatherName","motherName",
  "nomineeRelation","nomineeTitle","nomineeName","nomineeGender","nomineeSharePercentage","nomineeDOB",
  "bankAccountNumber","ifscCode","weightKgs","heightFeet","heightInches",
];

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

export default function TestCaseGeneratorPage() {
  const [rows, setRows] = useState<PramericaTestData[]>([]);
  const [dynamicExtras, setDynamicExtras] = useState<DynamicExtras[]>([]);
  const [count, setCount] = useState(1);
  const [running, setRunning] = useState(false);
  const [runStatus, setRunStatus] = useState<string | null>(null);
  const [fieldConfigs, setFieldConfigs] = useState<any[]>([]);
  const [useDynamicFields, setUseDynamicFields] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    loadFieldConfigs();
  }, []);

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
      const configs = await getFieldConfigs();
      setFieldConfigs(configs);
    } catch (err) {
      console.error("Failed to load field configs:", err);
    }
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
            appUrl: "https://nvestuat.pramericalife.in/Life/Login.html",
            insuranceInput: { age: 0, sumInsured: 0, policyType: "term" },
            steps: useDynamicFields ? buildDynamicSteps(mergeRowData(i), fieldConfigs) : buildSteps(testData),
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
    console.log(rows, '----->suryashhhhh')
    try {
      const testCases = rows.map((testData, i) => ({
        testCaseId: i + 1,
        url: "https://nvestuat.pramericalife.in/Life/Login.html",
        steps: useDynamicFields ? buildDynamicSteps(mergeRowData(i), fieldConfigs) : buildSteps(testData),
        testData: mergeRowData(i),
      }));
      console.log("Generated test cases:", testCases); // Debug log to verify test case structure
      const { results } = await runTestCases(testCases);
      // Build CSV/Excel content
      const header = "testCaseId,agentCode,proposerPAN,firstName,lastName,applicationNumber,status,error";
      const body = results.map(r =>
        `"${r.testCaseId}","${r.agentCode}","${r.proposerPAN}","${r.firstName}","${r.lastName}","${r.applicationNumber}","${r.status}","${r.error ?? ""}"`
      ).join("\n");
      downloadFile(`${header}\n${body}`, "application-numbers.csv", "text/csv");
      const passed = results.filter(r => r.status === "success").length;
      setRunStatus(`✅ ${passed}/${results.length} passed — Excel downloaded`);
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

  function exportCSV() {
    const header = CSV_HEADERS.join(",");
    const body = rows.map(r => CSV_HEADERS.map(h => `"${r[h]}"`).join(",")).join("\n");
    downloadFile(`${header}\n${body}`, "test-cases.csv", "text/csv");
  }

  function exportJSON() {
    const output = rows.map((testData, i) => ({
      testCaseId: i + 1,
      url: "https://nvestuat.pramericalife.in/Life/Login.html",
      steps: buildSteps(testData),
      testData,
    }));
    downloadFile(JSON.stringify(output, null, 2), "test-cases.json", "application/json");
  }

  function updateOtp(rowIdx: number, otp: string) {
    const digits = otp.replace(/\D/g, "").slice(0, 6).split("");
    setRows(r => r.map((row, i) => i !== rowIdx ? row : {
      ...row,
      otp1: digits[0] ?? "", otp2: digits[1] ?? "", otp3: digits[2] ?? "",
      otp4: digits[3] ?? "", otp5: digits[4] ?? "", otp6: digits[5] ?? "",
    }));
  }

  const visibleFields: (keyof PramericaTestData)[] = [
    "agentCode",
    "proposerPAN","mobileNumber","sameProposer","title","firstName","middleName","lastName","gender",
    "dateOfBirth","email","address1","address2","address3","landmark",
    "pinCode","state","city","monthlyIncome","monthlyExpenses","maritalStatus",
    "premiumMode","premiumChannel","premiumFrequency","planOption","premiumAmount",
    "policyTerm","premiumPayingTerm","education","occupation","natureOfDuty",
    "employerName","employerAddress","designation","annualIncome",
    "spouseName","fatherName","motherName",
    "nomineeRelation","nomineeTitle","nomineeName","nomineeGender","nomineeSharePercentage","nomineeDOB",
    "bankAccountNumber","ifscCode","weightKgs","heightFeet","heightInches",
  ];

  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set([0]));

  const toggleCard = (idx: number) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const renderField = (i: number, field: string, label: string, config?: any) => {
    const row = rows[i];
    const isDynOnly = !isStaticField(field);
    const dynValue = isDynOnly ? getDynamicValue(i, field) : "";

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
        <h1>Test Case Generator</h1>
        <div className="actions">
          <label style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: "16px" }}>
            <input
              type="checkbox"
              checked={useDynamicFields}
              onChange={(e) => setUseDynamicFields(e.target.checked)}
            />
            Use Dynamic Fields ({fieldConfigs.length})
          </label>
          <button onClick={applyDefaultsToAllRows} className="btn-secondary" title="Apply default values to all test cases">
            🔄 Apply Defaults
          </button>
          <button onClick={loadFieldConfigs} className="btn-secondary" title="Refresh field configurations">
            🔄 Refresh Fields
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
          <button onClick={exportCSV} className="btn-secondary">⬇ CSV</button>
          <button onClick={exportJSON} className="btn-secondary">⬇ JSON</button>
        </div>
      </div>

      <div className="stats">
        {rows.length} test case(s) • {useDynamicFields ? `Dynamic (${fieldConfigs.length} fields)` : "Static"} {runStatus && <span className="status">{runStatus}</span>} {saveStatus && <span className="status">{saveStatus}</span>}
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
                      <h3>{section}</h3>
                      <div className="fields-grid">
                        {fieldConfigs
                          .filter(f => f.section === section)
                          .map(config => renderField(i, config.fieldName, config.label, config))}
                      </div>
                    </div>
                  ))
                ) : (
                  // Static hardcoded fields
                  <>
                <div className="section">
                  <h3>Login Details</h3>
                  <div className="fields-grid">
                    {renderField(i, "agentCode", "Agent Code")}
                    <div className="field-group">
                      <label>OTP</label>
                      <input
                        value={`${row.otp1}${row.otp2}${row.otp3}${row.otp4}${row.otp5}${row.otp6}`}
                        onChange={e => updateOtp(i, e.target.value)}
                        maxLength={6}
                        placeholder="6-digit OTP"
                      />
                    </div>
                  </div>
                </div>

                <div className="section">
                  <h3>Personal Information</h3>
                  <div className="fields-grid">
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
                  </div>
                </div>

                <div className="section">
                  <h3>Address</h3>
                  <div className="fields-grid">
                    {renderField(i, "address1", "Address Line 1")}
                    {renderField(i, "address2", "Address Line 2")}
                    {renderField(i, "address3", "Address Line 3")}
                    {renderField(i, "landmark", "Landmark")}
                    {renderField(i, "pinCode", "Pin Code")}
                    {renderField(i, "state", "State")}
                    {renderField(i, "city", "City")}
                  </div>
                </div>

                <div className="section">
                  <h3>Financial Details</h3>
                  <div className="fields-grid">
                    {renderField(i, "monthlyIncome", "Monthly Income")}
                    {renderField(i, "monthlyExpenses", "Monthly Expenses")}
                    {renderField(i, "annualIncome", "Annual Income")}
                  </div>
                </div>

                <div className="section">
                  <h3>Policy Details</h3>
                  <div className="fields-grid">
                    {renderField(i, "premiumMode", "Premium Mode")}
                    {renderField(i, "premiumChannel", "Premium Channel")}
                    {renderField(i, "premiumFrequency", "Premium Frequency")}
                    {renderField(i, "planOption", "Plan Option")}
                    {renderField(i, "premiumAmount", "Premium Amount")}
                    {renderField(i, "policyTerm", "Policy Term")}
                    {renderField(i, "premiumPayingTerm", "Premium Paying Term")}
                  </div>
                </div>

                <div className="section">
                  <h3>Occupation</h3>
                  <div className="fields-grid">
                    {renderField(i, "education", "Education")}
                    {renderField(i, "occupation", "Occupation")}
                    {renderField(i, "natureOfDuty", "Nature of Duty")}
                    {renderField(i, "employerName", "Employer Name")}
                    {renderField(i, "employerAddress", "Employer Address")}
                    {renderField(i, "designation", "Designation")}
                  </div>
                </div>

                <div className="section">
                  <h3>Family Details</h3>
                  <div className="fields-grid">
                    {renderField(i, "spouseName", "Spouse Name")}
                    {renderField(i, "fatherName", "Father Name")}
                    {renderField(i, "motherName", "Mother Name")}
                  </div>
                </div>

                <div className="section">
                  <h3>Nominee Details</h3>
                  <div className="fields-grid">
                    {renderField(i, "nomineeRelation", "Relation")}
                    {renderField(i, "nomineeTitle", "Title")}
                    {renderField(i, "nomineeName", "Name")}
                    {renderField(i, "nomineeGender", "Gender")}
                    {renderField(i, "nomineeSharePercentage", "Share %")}
                    {renderField(i, "nomineeDOB", "Date of Birth")}
                  </div>
                </div>

                <div className="section">
                  <h3>Bank Details</h3>
                  <div className="fields-grid">
                    {renderField(i, "bankAccountNumber", "Account Number")}
                    {renderField(i, "ifscCode", "IFSC Code")}
                  </div>
                </div>

                <div className="section">
                  <h3>Health Information</h3>
                  <div className="fields-grid">
                    {renderField(i, "weightKgs", "Weight (kg)")}
                    {renderField(i, "heightFeet", "Height (feet)")}
                    {renderField(i, "heightInches", "Height (inches)")}
                  </div>
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
