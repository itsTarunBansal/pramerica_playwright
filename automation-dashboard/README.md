# Automation Dashboard

Next.js dashboard that reads Playwright execution reports and visualises:

- 📊 Test Execution summary (pass/fail/skip, duration charts)
- 📊 Third-Party API Performance (response time bar + trend charts)
- 🔴 Failed API Monitoring (status codes outside 200–299)
- 🟡 Slow API Monitoring (response time > 2000 ms)

## How it works

1. Run tests via the existing backend (`POST /api/v1/run-tests`).
2. The enhanced `apiLogger.js` automatically writes four JSON files to `backend/reports/`:
   - `test-execution-summary.json`
   - `third-party-api-report.json`
   - `api-performance-report.json`
   - `api-detailed-report.json`
3. The dashboard reads those files at request time — no database needed.

## Start

```bash
cd automation-dashboard
npm install
npm run dev        # http://localhost:3001
```

## Pages

| URL | Description |
|-----|-------------|
| `http://localhost:3001` | Test Execution Dashboard |
| `http://localhost:3001/api-performance` | Third-Party API Performance |
| `http://localhost:3001/failed-apis` | Failed API Monitoring |
| `http://localhost:3001/slow-apis` | Slow API Monitoring |

## Auto-refresh

Each page has an optional 30-second auto-refresh toggle in the top-right corner,
useful for monitoring a live test run.

## Third-party detection logic

A request is classified as third-party when its hostname differs from the
current page URL hostname (www-prefix normalised). The primary app domain is
detected dynamically per request — no hardcoding required.
