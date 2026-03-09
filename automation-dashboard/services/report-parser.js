import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// services/ is inside automation-dashboard/ — reports are at ../backend/reports
const REPORTS_DIR = path.resolve(__dirname, "../../backend/reports");

function readJson(filename) {
  const filePath = path.join(REPORTS_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

export function getExecutionSummary() {
  return readJson("test-execution-summary.json") ?? { total: 0, passed: 0, failed: 0, skipped: 0, totalDuration: 0, tests: [] };
}

export function getThirdPartyApis() {
  return readJson("third-party-api-report.json") ?? [];
}

export function getApiPerformance() {
  return readJson("api-performance-report.json") ?? [];
}

export function getDetailedReport() {
  return readJson("api-detailed-report.json") ?? [];
}

export function aggregateEndpointStats(logs) {
  const map = {};
  for (const log of logs) {
    const key = log.apiEndpoint;
    if (!map[key]) {
      map[key] = { apiEndpoint: log.apiEndpoint, domain: log.apiDomain, method: log.method, times: [], calls: 0 };
    }
    map[key].times.push(log.responseTime);
    map[key].calls++;
  }
  return Object.values(map).map((e) => ({
    apiEndpoint: e.apiEndpoint,
    domain: e.domain,
    method: e.method,
    totalCalls: e.calls,
    avgResponseTime: Math.round(e.times.reduce((a, b) => a + b, 0) / e.times.length),
    minResponseTime: Math.min(...e.times),
    maxResponseTime: Math.max(...e.times),
  }));
}
