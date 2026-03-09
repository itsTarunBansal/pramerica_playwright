# Kryptonite — AI Insurance Test Copilot

A full-stack test automation platform built for Pramerica Life Insurance. It lets QA teams create, manage, and execute end-to-end Playwright tests through a browser UI — no code required.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Backend](#backend)
4. [Frontend](#frontend)
5. [Automation Dashboard](#automation-dashboard)
6. [Test Execution Engine](#test-execution-engine)
7. [Dynamic Field System](#dynamic-field-system)
8. [API Logger & Reporting](#api-logger--reporting)
9. [Data Models](#data-models)
10. [Routing & Pages](#routing--pages)
11. [Authentication](#authentication)
12. [CI/CD & Docker](#cicd--docker)
13. [How a Test Run Works (End-to-End Flow)](#how-a-test-run-works-end-to-end-flow)
14. [Tech Stack](#tech-stack)
15. [Quick Start](#quick-start)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (User)                        │
│                                                             │
│   React Frontend (Vite)          Automation Dashboard       │
│   localhost:5173                 localhost:3000 (Next.js)   │
└────────────┬────────────────────────────┬───────────────────┘
             │ REST API                   │ /api/reports/*
             ▼                            ▼
┌─────────────────────────┐   ┌──────────────────────────────┐
│   Express Backend        │   │  Next.js API Routes          │
│   localhost:8000         │   │  (reads JSON report files)   │
└────────────┬────────────┘   └──────────────────────────────┘
             │
     ┌───────┴────────┐
     ▼                ▼
 MongoDB          Playwright
 (data store)   (browser runner)
```

Three independent apps work together:

| App | Tech | Port | Purpose |
|-----|------|------|---------|
| `backend/` | Node.js + Express | 8000 | REST API, test runner, DB access |
| `frontend/` | React + Vite + TypeScript | 5173 | Test management UI |
| `automation-dashboard/` | Next.js | 3000 | Read-only reporting dashboard |

---

## Project Structure

```
pramerica_playwright/
├── backend/                  # Express API + Playwright runner
│   └── src/
│       ├── models/           # Mongoose schemas
│       ├── routes/           # REST endpoints
│       ├── services/         # apiLogger (network capture + Excel export)
│       ├── startup/          # DB seed on boot
│       ├── app.js            # Express app factory
│       ├── server.js         # HTTP server entry point
│       ├── db.js             # MongoDB connection
│       └── config.js         # Environment config
│
├── frontend/                 # React SPA
│   └── src/
│       ├── pages/            # All UI pages
│       ├── services/         # API client, step builders
│       ├── context/          # Project + Theme context
│       ├── auth/             # Session management
│       ├── types.ts          # Shared TypeScript types
│       └── App.tsx           # Router + NavBar
│
├── automation-dashboard/     # Next.js reporting dashboard
│   ├── app/                  # App Router pages
│   ├── components/           # Charts, tables, stat cards
│   └── services/             # report-parser.js
│
├── tests/                    # Playwright spec files
├── docs/                     # Markdown documentation
├── .github/                  # GitHub Actions + AI agent configs
├── docker-compose.yml        # Multi-container setup
└── playwright.config.ts      # Playwright global config
```

---

## Backend

### Entry Point

`server.js` starts the HTTP server. `app.js` creates the Express app, registers all middleware and routers.

### API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/health` | Health check |
| GET/POST | `/api/v1/test-cases` | List / create test cases |
| PUT/DELETE | `/api/v1/test-cases/:id` | Update / delete a test case |
| POST | `/api/v1/run-tests` | Execute tests via Playwright |
| GET/POST | `/api/v1/field-configs` | List / create dynamic fields |
| PUT/DELETE | `/api/v1/field-configs/:id` | Update / delete a field |
| POST | `/api/v1/field-configs/reorder` | Reorder fields by drag-and-drop |
| GET/POST | `/api/v1/projects` | Project management |
| GET | `/api/v1/executions` | Execution history |
| GET | `/api/v1/api-logs` | Captured network logs |

### Config (`config.js`)

Reads environment variables: `MONGO_URI`, `PORT`, `TENANT_ID`, etc.

---

## Frontend

### Pages

| Page | Route | Purpose |
|------|-------|---------|
| `LandingPage` | `/` | Home / welcome screen |
| `LoginPage` | `/login` | Username + password login |
| `ProjectsPage` | `/projects` | List all projects |
| `NewProjectPage` | `/projects/new` | Create a project |
| `DynamicProjectPage` | `/projects/:id` | Per-project overview |
| `TestCaseGeneratorPage` | `/generator` or `/projects/:id/generator` | Build & run test cases |
| `FieldManagerPage` | `/field-manager` or `/projects/:id/field-manager` | Manage dynamic fields |
| `DashboardPage` | `/dashboard` | Execution stats |
| `ApiLogDashboard` | `/projects/:id/api-logs` | Network log viewer |
| `AdminPage` | `/admin` | Admin-only controls |
| `PramericaTestPage` | `/pramerica` | Legacy hardcoded test page |
| `TestBuilderPage` | `/builder` | Visual step builder |

### Services

| File | Purpose |
|------|---------|
| `api.ts` | Axios/fetch wrapper for all backend calls |
| `playwrightSteps.ts` | Hardcoded step builder for the full Pramerica insurance journey |
| `dynamicSteps.ts` | Builds steps at runtime from `FieldConfig` records stored in MongoDB |

### Context

- `ProjectContext` — holds the active project URL and tenant ID; provides `NVEST_TENANT_ID` constant.
- `ThemeContext` — dark/light mode toggle, persisted to `localStorage`.

---

## Automation Dashboard

A separate Next.js app (`automation-dashboard/`) that reads JSON report files written by the backend after each test run.

### Pages

| Route | Description |
|-------|-------------|
| `/` | Test execution summary — pass/fail/skip counts, pie chart, duration bar chart, results table |
| `/api-performance` | Third-party API response time analysis |
| `/slow-apis` | APIs exceeding a response time threshold |
| `/failed-apis` | APIs that returned 4xx/5xx or failed entirely |

### Data Flow

```
Backend test run → writes JSON files to backend/reports/
                        ↓
Next.js API routes read those files
                        ↓
Dashboard pages fetch from /api/reports/*
                        ↓
Charts + tables rendered with Recharts
```

Report files written:

| File | Content |
|------|---------|
| `test-execution-summary.json` | Pass/fail/skip counts + per-test results |
| `api-detailed-report.json` | Every captured network request |
| `api-performance-report.json` | Per-endpoint aggregated stats (third-party only) |
| `third-party-api-report.json` | Raw third-party API logs |

---

## Test Execution Engine

`backend/src/routes/runTests.js` is the core runner.

### Flow

1. Frontend POSTs `{ testCases, projectId }` to `/api/v1/run-tests`.
2. Backend launches a Chromium browser (non-headless, maximized).
3. For each test case:
   - Opens a new browser context + page.
   - Attaches the network logger (`attachNetworkLogger`).
   - Iterates through `steps[]` and executes each action.
4. Supported step actions:

| Action | What it does |
|--------|-------------|
| `goto` | Navigate to URL |
| `fill` | Type into a text field |
| `click` | Click an element |
| `check` | Check a checkbox |
| `select` | Choose a dropdown option |
| `press` | Press a keyboard key |
| `wait` | Wait N milliseconds |
| `scrollIntoView` | Scroll element into view |
| `logButtons` | Debug: log all visible button labels |
| `captureAppNumber` | Scrape the application number from the page |

5. Conditional steps: if a step has `conditions[]`, all conditions must match values in `stepContext` (AND logic) or the step is skipped.
6. `captureAs`: a step can save its value into `stepContext` for later conditions to reference.
7. After all steps, API logs are flushed, saved to MongoDB, and exported to Excel.
8. Results array is returned to the frontend.

### Error Handling

`formatPlaywrightError()` converts raw Playwright error messages into human-readable strings covering: timeouts, navigation failures, strict mode violations, dropdown mismatches, and fill failures.

---

## Dynamic Field System

The key feature that allows test steps to be managed from the UI without touching code.

### How it works

1. A `FieldConfig` document in MongoDB describes one step: its selector, action type, label, section, order, and optional conditions.
2. `FieldManagerPage` (frontend) provides a drag-and-drop UI to create/edit/delete/reorder fields.
3. `TestCaseGeneratorPage` loads field configs from the API and calls `buildDynamicSteps()`.
4. `buildDynamicSteps()` (`dynamicSteps.ts`) maps each `FieldConfig` + test data values into a `steps[]` array.
5. That `steps[]` array is sent to the backend runner.

### FieldConfig properties

| Property | Purpose |
|----------|---------|
| `fieldName` | Key in test data object |
| `label` | Display name in UI |
| `section` | Groups fields visually |
| `actionType` | `fill`, `click`, `select`, `check`, `press`, `wait` |
| `selector` | Playwright locator string |
| `inputType` | UI input type: `text`, `number`, `select`, `checkbox`, `date` |
| `selectOptions` | Dropdown choices (for UI rendering) |
| `defaultValue` | Used when test data has no value |
| `order` | Execution order |
| `isRequired` | Validation flag |
| `isActive` | Include/exclude from runs |
| `isSkipped` | Skip this step at runtime |
| `captureAs` | Save step value into runtime context |
| `conditions` | `[{ ref, equals }]` — conditional execution |

---

## API Logger & Reporting

`backend/src/services/apiLogger.js` intercepts all network traffic during a test run.

### What it captures

- Every XHR/fetch/document request (skips images, fonts, CSS, JS assets).
- Request method, URL, payload, status code, response time, response body (JSON only, truncated to 500 chars).
- Third-party requests (different domain than the app under test) are tracked separately.

### Outputs

- Excel report (`API_Test_Report_<timestamp>.xlsx`) — one row per request, color-coded failures.
- MongoDB `ApiLog` collection — queryable via `/api/v1/api-logs`.
- Four JSON files in `backend/reports/` consumed by the automation dashboard.

---

## Data Models

### TestCase

```
id, tenantId, name, appUrl, insuranceInput, steps[], createdBy, createdAt
```

### FieldConfig

```
id, tenantId, fieldName, label, section, actionType, selector,
inputType, selectOptions[], defaultValue, order, isRequired,
isActive, isSkipped, captureAs, conditions[]
```

### Execution

```
id, tenantId, testCaseId, browser, status, startedAt, finishedAt, resultJson
```

### ApiLog

```
testCase, testCaseId, projectId, runId, pageUrl, apiEndpoint,
method, statusCode, startTime, endTime, responseTime,
requestPayload, responseBody, tags[]
```

---

## Routing & Pages

All frontend routes are protected by `ProtectedRoute` (checks session). The only public route is `/login`.

`ProjectToolWrapper` is a helper component that loads a project by `:projectId` URL param and renders either `TestCaseGeneratorPage` or `FieldManagerPage` with the correct `tenantId` and `projectUrl`.

---

## Authentication

`frontend/src/auth/authService.ts` manages a simple session stored in `sessionStorage` (or `localStorage`). `getSession()` returns the current user object; `clearSession()` logs out. The `ProtectedRoute` component redirects unauthenticated users to `/login`. Admin-only routes (e.g. `/admin`) check `user.role === "admin"`.

---

## CI/CD & Docker

### GitHub Actions

- `.github/workflows/playwright.yml` — runs Playwright tests on push/PR.
- `.github/workflows/copilot-setup-steps.yml` — GitHub Copilot workspace setup.

### AI Agent Configs (`.github/agents/`)

| File | Purpose |
|------|---------|
| `playwright-test-generator.agent.md` | Generates new test cases |
| `playwright-test-healer.agent.md` | Auto-fixes broken selectors |
| `playwright-test-planner.agent.md` | Plans test coverage |

### Docker

`docker-compose.yml` orchestrates backend + frontend containers. Each app has its own `Dockerfile`.

---

## How a Test Run Works (End-to-End Flow)

```
1. User opens TestCaseGeneratorPage
        ↓
2. Selects a project → tenantId resolved
        ↓
3. Enables "Use Dynamic Fields"
   → Frontend fetches FieldConfigs from GET /api/v1/field-configs?tenantId=...
        ↓
4. User fills in test data (agent code, PAN, name, DOB, etc.)
        ↓
5. Clicks "Run Tests"
   → buildDynamicSteps(testData, fieldConfigs, projectUrl) called
   → steps[] array assembled in field order
        ↓
6. POST /api/v1/run-tests  { testCases: [{ testCaseId, testData, steps }], projectId }
        ↓
7. Backend launches Chromium
   → Attaches network logger
   → Executes each step (goto, fill, click, select, check, press, wait…)
   → Captures application number via captureAppNumber step
        ↓
8. After run:
   → API logs flushed + saved to MongoDB
   → Excel report written to backend/reports/
   → JSON dashboard reports written to backend/reports/
        ↓
9. Response returned to frontend: { results[], apiReportPath, runId }
        ↓
10. User sees pass/fail per test case + application numbers
    Automation Dashboard shows charts from JSON reports
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Test Runner | Playwright (Chromium) |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Frontend | React 18, TypeScript, Vite |
| Dashboard | Next.js 14 (App Router), Recharts, Tailwind CSS |
| Reporting | ExcelJS (xlsx), JSON files |
| Auth | Session-based (sessionStorage) |
| Containerization | Docker, docker-compose |
| CI | GitHub Actions |

---

## Quick Start

```bash
# 1. Start MongoDB
net start MongoDB          # Windows

# 2. Backend
cd backend
npm install
npm run seed:fields        # seed initial field configs
npm start                  # http://localhost:8000

# 3. Frontend
cd frontend
npm install
npm run dev                # http://localhost:5173

# 4. Dashboard (optional)
cd automation-dashboard
npm install
npm run dev                # http://localhost:3000
```

### Key URLs

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Main app |
| http://localhost:5173/field-manager | Manage test fields |
| http://localhost:5173/generator | Create & run tests |
| http://localhost:5173/projects | Project list |
| http://localhost:8000 | Backend API |
| http://localhost:3000 | Automation dashboard |
