import { useState } from "react";
import type { PramericaTestData } from "../types";
import { buildSteps } from "../services/playwrightSteps";
import { runTestCases } from "../services/api";

const CSV_HEADERS: (keyof PramericaTestData)[] = [
  "agentCode","otp1","otp2","otp3","otp4","otp5","otp6",
  "proposerPAN","mobileNumber","title","firstName","middleName","lastName","gender",
  "dateOfBirth","email","address1","address2","address3","landmark",
  "pinCode","state","city","monthlyIncome","monthlyExpenses","maritalStatus",
  "premiumMode","premiumChannel","premiumFrequency","premiumAmount",
];

const DEFAULT_ROW: PramericaTestData = {
  agentCode: "70016333", otp1: "1", otp2: "2", otp3: "3", otp4: "1", otp5: "2", otp6: "3",
  proposerPAN: "LLLLL9999H", mobileNumber: "8888888888", title: "MR",
  firstName: "Testing", middleName: "Testing", lastName: "Testing",gender: "Male",
  dateOfBirth: "22/10/1990", email: "test@pramericalife.in",
  address1: "gggui", address2: "gugiuhg", address3: "huhujh", landmark: "gugiuhgju",
  pinCode: "122018", state: "Haryana", city: "Adampur 1- Haryana",
  monthlyIncome: "1,00,0000", monthlyExpenses: "1,0000", maritalStatus: "married",
  premiumMode: "1", premiumChannel: "19", premiumFrequency: "3", premiumAmount: "5,0000",
};

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function TestCaseGeneratorPage() {
  const [rows, setRows] = useState<PramericaTestData[]>([{ ...DEFAULT_ROW }]);
  const [count, setCount] = useState(1);
  const [running, setRunning] = useState(false);
  const [runStatus, setRunStatus] = useState<string | null>(null);

  async function runTests() {
    setRunning(true);
    setRunStatus(null);
    try {
      const testCases = rows.map((testData, i) => ({
        testCaseId: i + 1,
        url: "https://nvestuat.pramericalife.in/Life/Login.html",
        steps: buildSteps(testData),
        testData,
      }));
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
      return [...r, ...Array.from({ length: count }, (_, i) => ({
        ...DEFAULT_ROW,
        agentCode: String(lastCode + i + 1),
      }))];
    });
  }

  function updateCell(rowIdx: number, field: keyof PramericaTestData, value: string) {
    setRows(r => r.map((row, i) => i === rowIdx ? { ...row, [field]: value } : row));
  }

  function deleteRow(idx: number) {
    setRows(r => r.filter((_, i) => i !== idx));
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
    "agentCode","proposerPAN","mobileNumber","title",
    "firstName","lastName","gender","dateOfBirth","email",
    "pinCode","state","city","maritalStatus","premiumAmount",
  ];

  return (
    <section className="panel">
      <h2>Test Case Generator</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "16px", alignItems: "center" }}>
        <label>
          Add rows:&nbsp;
          <input
            type="number" min={1} max={50} value={count}
            onChange={e => setCount(Number(e.target.value))}
            style={{ width: "60px" }}
          />
        </label>
        <button type="button" onClick={addRows}>+ Add</button>
        <button type="button" onClick={runTests} disabled={running} style={{ background: "#1a7f37", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "4px", cursor: running ? "not-allowed" : "pointer" }}>
          {running ? "⏳ Running..." : "▶ Run Test Cases"}
        </button>
        <button type="button" onClick={exportCSV} style={{ marginLeft: "auto" }}>⬇ Export CSV</button>
        <button type="button" onClick={exportJSON}>⬇ Export JSON</button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "12px" }}>
          <thead>
            <tr>
              <th style={th}>#</th>
              <th style={th}>agentCode</th>
              <th style={th}>otp</th>
              {visibleFields.filter(f => f !== "agentCode").map(f => <th key={f} style={th}>{f}</th>)}
              <th style={th}>Del</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td style={td}>{i + 1}</td>
                <td style={td}><input value={row.agentCode} onChange={e => updateCell(i, "agentCode", e.target.value)} style={{ width: "90px" }} /></td>
                <td style={td}>
                  <input
                    value={`${row.otp1}${row.otp2}${row.otp3}${row.otp4}${row.otp5}${row.otp6}`}
                    onChange={e => updateOtp(i, e.target.value)}
                    maxLength={6}
                    style={{ width: "60px" }}
                  />
                </td>
                {visibleFields.filter(f => f !== "agentCode").map(f => (
                  <td key={f} style={td}>
                    {f === "title" ? (
                      <select value={row[f]} onChange={e => {
                        const t = e.target.value;
                        const gender = t === "MR" ? "Male" : "Female";
                        setRows(r => r.map((row, ri) => ri === i ? { ...row, title: t, gender } : row));
                      }} style={{ width: "60px" }}>
                        <option>MR</option><option>MRS</option><option>MS</option>
                      </select>
                    ) : f === "maritalStatus" ? (
                      <select value={row[f]} onChange={e => updateCell(i, f, e.target.value)} style={{ width: "80px" }}>
                        <option value="married">married</option><option value="single">single</option>
                      </select>
                    ) : (
                      <input
                        value={row[f]}
                        onChange={e => updateCell(i, f, e.target.value)}
                        style={{ width: f === "email" || f === "city" ? "160px" : "90px" }}
                      />
                    )}
                  </td>
                ))}
                <td style={td}>
                  <button type="button" onClick={() => deleteRow(i)} style={{ color: "red" }}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>
        {rows.length} test case(s) · Export JSON includes all 29 fields and full Playwright steps per row.
      </p>
      {runStatus && <p style={{ marginTop: "8px", fontSize: "13px" }}>{runStatus}</p>}
    </section>
  );
}

const th: React.CSSProperties = { border: "1px solid #ccc", padding: "4px 6px", background: "#f5f5f5", whiteSpace: "nowrap" };
const td: React.CSSProperties = { border: "1px solid #eee", padding: "2px 4px" };
