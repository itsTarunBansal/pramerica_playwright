// Backfill script: reads the latest Excel report and generates JSON dashboard files
// Run once: node backend/src/backfill-reports.js
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = path.resolve(__dirname, "../reports");

const files = fs.readdirSync(REPORTS_DIR).filter((f) => f.endsWith(".xlsx")).sort();
if (!files.length) { console.log("No xlsx files found."); process.exit(0); }

const latest = files[files.length - 1];
console.log("Reading:", latest);

const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(path.join(REPORTS_DIR, latest));
const sheet = wb.getWorksheet("API Logs");

const allLogs = [];
sheet.eachRow((row, i) => {
  if (i === 1) return;
  const statusRaw = row.getCell(5).value;
  const rtRaw = row.getCell(8).value;
  allLogs.push({
    testCase: String(row.getCell(1).value ?? ""),
    pageUrl: String(row.getCell(2).value ?? ""),
    apiEndpoint: String(row.getCell(3).value ?? ""),
    method: String(row.getCell(4).value ?? ""),
    statusCode: statusRaw === "FAILED" ? "FAILED" : Number(statusRaw ?? 0),
    startTime: String(row.getCell(6).value ?? ""),
    endTime: String(row.getCell(7).value ?? ""),
    responseTime: Number(rtRaw ?? 0),
    requestPayload: row.getCell(9).value ? String(row.getCell(9).value) : null,
    responseBody: row.getCell(10).value ? String(row.getCell(10).value) : null,
  });
});

console.log("Total rows:", allLogs.length);

// Detect app domain from the most common pageUrl hostname
const hostCounts = {};
for (const l of allLogs) {
  try { const h = new URL(l.pageUrl).hostname; hostCounts[h] = (hostCounts[h] ?? 0) + 1; } catch {}
}
const appHost = Object.entries(hostCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
console.log("Detected app domain:", appHost);

function getHostname(url) { try { return new URL(url).hostname; } catch { return null; } }
function normalize(h) { return h.replace(/^www\./, ""); }
function isThirdParty(url) {
  const h = getHostname(url);
  if (!h || !appHost) return false;
  return normalize(h) !== normalize(appHost);
}

const thirdPartyLogs = allLogs
  .filter((l) => isThirdParty(l.apiEndpoint))
  .map((l) => ({ ...l, apiDomain: getHostname(l.apiEndpoint) }));

console.log("Third-party logs:", thirdPartyLogs.length);

// api-detailed-report.json
fs.writeFileSync(path.join(REPORTS_DIR, "api-detailed-report.json"), JSON.stringify(allLogs, null, 2));

// third-party-api-report.json
fs.writeFileSync(path.join(REPORTS_DIR, "third-party-api-report.json"), JSON.stringify(thirdPartyLogs, null, 2));

// api-performance-report.json
const perfMap = {};
for (const l of thirdPartyLogs) {
  if (!perfMap[l.apiEndpoint]) perfMap[l.apiEndpoint] = { apiEndpoint: l.apiEndpoint, apiDomain: l.apiDomain, method: l.method, times: [], calls: 0 };
  perfMap[l.apiEndpoint].times.push(l.responseTime);
  perfMap[l.apiEndpoint].calls++;
}
const perfReport = Object.values(perfMap).map((e) => ({
  apiEndpoint: e.apiEndpoint, apiDomain: e.apiDomain, method: e.method, totalCalls: e.calls,
  avgResponseTime: Math.round(e.times.reduce((a, b) => a + b, 0) / e.times.length),
  minResponseTime: Math.min(...e.times), maxResponseTime: Math.max(...e.times),
}));
fs.writeFileSync(path.join(REPORTS_DIR, "api-performance-report.json"), JSON.stringify(perfReport, null, 2));

// test-execution-summary.json — derive from unique test cases in allLogs
const tcMap = {};
for (const l of allLogs) {
  if (!tcMap[l.testCase]) tcMap[l.testCase] = { testCaseId: l.testCase, status: "passed", duration: 0, error: null };
  if (l.statusCode === "FAILED" || (typeof l.statusCode === "number" && l.statusCode >= 500)) {
    tcMap[l.testCase].status = "failed";
  }
}
const tests = Object.values(tcMap);
const summary = {
  total: tests.length, passed: tests.filter((t) => t.status === "passed").length,
  failed: tests.filter((t) => t.status === "failed").length, skipped: 0,
  totalDuration: 0, generatedAt: new Date().toISOString(), tests,
};
fs.writeFileSync(path.join(REPORTS_DIR, "test-execution-summary.json"), JSON.stringify(summary, null, 2));

console.log("✅ Dashboard JSON reports generated in", REPORTS_DIR);
