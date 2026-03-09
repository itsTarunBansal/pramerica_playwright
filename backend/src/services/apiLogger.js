import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { ApiLog } from "../models/apiLog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = path.resolve(__dirname, "../../reports");

// Central accumulator for the entire test run
const apiLogs = [];

// ─── Third-Party API Capture (dashboard layer — non-breaking) ───────────────
// Accumulates only third-party API logs for dashboard JSON reports
const thirdPartyLogs = [];

/** Extract hostname from a URL string, returns null on failure */
function getHostname(url) {
  try { return new URL(url).hostname; } catch { return null; }
}

/** Returns true if requestUrl is on a different domain than appBaseUrl */
function isThirdParty(requestUrl, appBaseUrl) {
  const reqHost = getHostname(requestUrl);
  const appHost = getHostname(appBaseUrl);
  if (!reqHost || !appHost) return false;
  // Strip www. prefix for comparison
  const normalize = (h) => h.replace(/^www\./, "");
  return normalize(reqHost) !== normalize(appHost);
}

// Derive a short tag from URL path segment (e.g. 'login', 'kyc', 'policy')
function deriveTag(url) {
  try {
    const seg = new URL(url).pathname.split('/').filter(Boolean);
    return seg.length ? [seg[seg.length - 1].split('.')[0].toLowerCase()] : [];
  } catch { return []; }
}

/**
 * Attach network listeners to a Playwright page.
 * Logs every request/response pair under the given testCaseName.
 */
export function attachNetworkLogger(page, testCaseName) {
  const pendingRequests = new Map();
  const pendingResponses = []; // track in-flight async body reads

  // Asset types to skip — capture everything else (xhr, fetch, document, other, etc.)
  const SKIP_TYPES = new Set(["image", "stylesheet", "font", "media", "websocket", "manifest", "texttrack", "eventsource", "ping"]);

  page.on("request", (request) => {
    const type = request.resourceType();
    if (SKIP_TYPES.has(type)) return;
    const url = request.url();
    if (/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot|map)([?#]|$)/i.test(url)) return;
    pendingRequests.set(request, {
      startTime: Date.now(),
      url: request.url(),
      method: request.method(),
      postData: request.postData() ?? null,
    });
    console.log(`[API Logger] Captured [${request.resourceType()}] ${request.method()} ${request.url()}`);
  });

  page.on("response", (response) => {
    const request = response.request();
    const pending = pendingRequests.get(request);
    if (!pending) return;
    pendingRequests.delete(request);

    const endTime = Date.now();
    const responseTime = endTime - pending.startTime;

    // Build the log entry immediately (sync), then try to read body async
    const entry = {
      testCase: testCaseName,
      pageUrl: page.url(),
      apiEndpoint: pending.url,
      method: pending.method,
      statusCode: response.status(),
      startTime: new Date(pending.startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      responseTime,
      requestPayload: pending.postData,
      responseBody: null,
      tags: deriveTag(pending.url),
    };
    apiLogs.push(entry);

    // ── Dashboard: capture third-party API entry (non-breaking addition) ──
    const appBase = page.url();
    if (isThirdParty(pending.url, appBase)) {
      const tpEntry = {
        testCase: testCaseName,
        pageUrl: appBase,
        apiEndpoint: pending.url,
        apiDomain: getHostname(pending.url),
        method: pending.method,
        statusCode: response.status(),
        startTime: new Date(pending.startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        responseTime,
        requestPayload: pending.postData,
        responseBody: null,
      };
      thirdPartyLogs.push(tpEntry);
      // Reuse the same async body read promise
      const contentType = response.headers()["content-type"] ?? "";
      if (contentType.includes("application/json")) {
        const p = response.text().then(text => {
          entry.responseBody = text.length > 500 ? text.slice(0, 500) + "\u2026" : text;
          tpEntry.responseBody = entry.responseBody;
        }).catch(() => {});
        pendingResponses.push(p);
      }
    } else {
      // Attempt async body read — update entry in place if it succeeds
      const contentType = response.headers()["content-type"] ?? "";
      if (contentType.includes("application/json")) {
        const p = response.text().then(text => {
          entry.responseBody = text.length > 500 ? text.slice(0, 500) + "\u2026" : text;
        }).catch(() => {});
        pendingResponses.push(p);
      }
    }
  });

  page.on("requestfailed", (request) => {
    const pending = pendingRequests.get(request);
    if (!pending) return;
    pendingRequests.delete(request);

    const endTime = Date.now();
    const failedEntry = {
      testCase: testCaseName,
      pageUrl: page.url(),
      apiEndpoint: pending.url,
      method: pending.method,
      statusCode: "FAILED",
      startTime: new Date(pending.startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      responseTime: endTime - pending.startTime,
      requestPayload: pending.postData,
      responseBody: request.failure()?.errorText ?? null,
      tags: deriveTag(pending.url),
    };
    apiLogs.push(failedEntry);

    // ── Dashboard: capture failed third-party requests too ──
    if (isThirdParty(pending.url, page.url())) {
      thirdPartyLogs.push({ ...failedEntry, apiDomain: getHostname(pending.url) });
    }
  });

  // Call this before closing the page to await all in-flight body reads
  page._flushApiLogs = () => Promise.allSettled(pendingResponses);
  return () => Promise.allSettled(pendingResponses);
}

/**
 * Export all accumulated API logs to an Excel file.
 * Returns the file path of the generated report.
 */
export async function exportApiLogsToExcel() {
  if (apiLogs.length === 0) return null;

  const { mkdirSync } = await import("fs");
  mkdirSync(REPORTS_DIR, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.join(REPORTS_DIR, `API_Test_Report_${timestamp}.xlsx`);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("API Logs");

  sheet.columns = [
    { header: "Test Case",        key: "testCase",       width: 25 },
    { header: "Page URL",         key: "pageUrl",        width: 35 },
    { header: "API Endpoint",     key: "apiEndpoint",    width: 50 },
    { header: "Method",           key: "method",         width: 10 },
    { header: "Status Code",      key: "statusCode",     width: 14 },
    { header: "Start Time",       key: "startTime",      width: 26 },
    { header: "End Time",         key: "endTime",        width: 26 },
    { header: "Response Time (ms)", key: "responseTime", width: 20 },
    { header: "Request Payload",  key: "requestPayload", width: 40 },
    { header: "Response Body",    key: "responseBody",   width: 50 },
  ];

  // Style header row
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: "pattern", pattern: "solid",
    fgColor: { argb: "FF4472C4" },
  };
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

  for (const log of apiLogs) {
    const row = sheet.addRow(log);
    // Highlight failed requests
    if (log.statusCode === "FAILED" || (typeof log.statusCode === "number" && log.statusCode >= 400)) {
      row.getCell("statusCode").font = { color: { argb: "FFFF0000" }, bold: true };
    }
  }

  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

/** Save in-memory logs to MongoDB for a given project + run */
export async function saveLogsToDb(projectId, runId) {
  if (!apiLogs.length) {
    console.warn("[API Logger] No logs to save for run:", runId);
    return;
  }
  console.log(`[API Logger] Saving ${apiLogs.length} logs for project=${projectId} run=${runId}`);
  const docs = apiLogs.map(l => ({ ...l, projectId, runId, testCaseId: l.testCase }));
  await ApiLog.insertMany(docs);
}

/** Clear logs between runs */
export function clearApiLogs() {
  apiLogs.length = 0;
  thirdPartyLogs.length = 0;
}

/**
 * Generate JSON report files for the dashboard.
 * Called after test run completes — does NOT affect Excel export or DB save.
 */
export async function generateDashboardReports(testResults = []) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  // third-party-api-report.json — raw third-party logs
  fs.writeFileSync(
    path.join(REPORTS_DIR, "third-party-api-report.json"),
    JSON.stringify(thirdPartyLogs, null, 2)
  );

  // api-detailed-report.json — all captured logs
  fs.writeFileSync(
    path.join(REPORTS_DIR, "api-detailed-report.json"),
    JSON.stringify(apiLogs, null, 2)
  );

  // api-performance-report.json — per-endpoint aggregation of third-party APIs
  const perfMap = {};
  for (const l of thirdPartyLogs) {
    if (!perfMap[l.apiEndpoint]) {
      perfMap[l.apiEndpoint] = { apiEndpoint: l.apiEndpoint, apiDomain: l.apiDomain, method: l.method, times: [], calls: 0 };
    }
    perfMap[l.apiEndpoint].times.push(l.responseTime);
    perfMap[l.apiEndpoint].calls++;
  }
  const perfReport = Object.values(perfMap).map((e) => ({
    apiEndpoint: e.apiEndpoint,
    apiDomain: e.apiDomain,
    method: e.method,
    totalCalls: e.calls,
    avgResponseTime: Math.round(e.times.reduce((a, b) => a + b, 0) / e.times.length),
    minResponseTime: Math.min(...e.times),
    maxResponseTime: Math.max(...e.times),
  }));
  fs.writeFileSync(
    path.join(REPORTS_DIR, "api-performance-report.json"),
    JSON.stringify(perfReport, null, 2)
  );

  // test-execution-summary.json — test results summary
  const passed = testResults.filter((t) => t.status === "success" || t.status === "passed").length;
  const failed = testResults.filter((t) => t.status === "failed").length;
  const skipped = testResults.filter((t) => t.status === "skipped").length;
  const summary = {
    total: testResults.length,
    passed,
    failed,
    skipped,
    totalDuration: testResults.reduce((a, t) => a + (t.duration ?? 0), 0),
    generatedAt: new Date().toISOString(),
    tests: testResults.map((t) => ({
      testCaseId: t.testCaseId,
      status: t.status === "success" ? "passed" : t.status,
      duration: t.duration ?? 0,
      error: t.error ?? null,
    })),
  };
  fs.writeFileSync(
    path.join(REPORTS_DIR, "test-execution-summary.json"),
    JSON.stringify(summary, null, 2)
  );

  console.log(`[Dashboard] Reports generated in ${REPORTS_DIR}`);
}

export { apiLogs };
