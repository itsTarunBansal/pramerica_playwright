# Frontend Documentation (React + Vite)

This document describes the current frontend behavior in `frontend/src`, including request payloads, expected responses, and validations currently implemented.

## App Overview
- Framework: React 18 + TypeScript + React Router
- Build tool: Vite
- API base URL: `VITE_API_URL` (fallback `http://localhost:8000`)
- Routes:
  - `/` -> Dashboard
  - `/builder` -> No-Code Test Builder

## Environment Variables
- `VITE_API_URL` (default fallback in code: `http://localhost:8000`)

## Frontend Data Types (Current)
From `frontend/src/types.ts`:

### `TestAction`
```ts
"goto" | "click" | "fill" | "wait" | "assert"
```

### `TestStep`
```ts
{
  order: number;
  action: TestAction;
  selector?: string;
  value?: string;
  timeout_ms?: number;
  expected?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}
```

### `InsuranceInput`
```ts
{
  age: number;
  sumInsured: number;
  policyType: string;
  rider?: string;
  premiumExpected?: number;
}
```

## API Service Layer
All calls are implemented in `frontend/src/services/api.ts`.

### Shared constants
- `API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000"`
- `DEMO_TENANT_ID = "00000000-0000-0000-0000-000000000001"`

`createTestCase()` always injects `tenantId` using this constant.

## API Call: `getHealth()`
Calls:
- `GET {API_URL}/api/v1/health`

Success response expected:
```json
{
  "status": "ok"
}
```

Client-side behavior:
- If HTTP status is not `2xx`, throws `Error("Health check failed")`.

## API Call: `listTestCases()`
Calls:
- `GET {API_URL}/api/v1/test-cases`

Backend response expected (array of objects). Frontend maps each row to:
```json
{
  "id": "string",
  "name": "string",
  "appUrl": "string"
}
```

Client-side behavior:
- If HTTP status is not `2xx`, throws `Error("Failed to list test cases")`.
- Other backend fields are ignored by this view (`tenantId`, `steps`, etc. are not shown in dashboard list).

## API Call: `createTestCase(input)`
Calls:
- `POST {API_URL}/api/v1/test-cases/`

### Frontend request payload shape
```json
{
  "tenantId": "00000000-0000-0000-0000-000000000001",
  "name": "Insurance Premium Validation",
  "appUrl": "https://example-insurance-app.com",
  "insuranceInput": {
    "age": 35,
    "sumInsured": 1000000,
    "policyType": "Term",
    "rider": "Critical Illness",
    "premiumExpected": 15420.5
  },
  "steps": [
    { "order": 1, "action": "goto", "value": "https://example-insurance-app.com/quote" }
  ]
}
```

### Expected backend success response
The function returns backend JSON as-is. Typical shape:
```json
{
  "id": "uuid",
  "tenantId": "uuid",
  "name": "string",
  "appUrl": "string",
  "insuranceInput": {},
  "steps": [],
  "createdBy": null,
  "createdAt": "2026-02-27T09:20:31.862Z"
}
```

### Error behavior
- For non-2xx responses:
  - reads `response.text()`
  - throws `Error(<response text>)` if present
  - otherwise throws `Error("Failed to create test case")`

Important note:
- Backend returns JSON error (`{"error":"..."}`), but frontend currently throws the raw text string, so UI error may show JSON text instead of extracted message.

## Page: Dashboard (`/`)
File: `frontend/src/pages/DashboardPage.tsx`

On mount:
1. Calls `getHealth()`
2. Calls `listTestCases()`

Rendered sections:
- Platform status (`health`)
- Recent test cases list (`name`, `appUrl`)

Error handling:
- Any error from either call sets a shared `error` state.

## Page: No-Code Test Builder (`/builder`)
File: `frontend/src/pages/TestBuilderPage.tsx`

### Form fields
- Test Case Name (`name`)
- Application URL (`appUrl`)
- Insurance fields:
  - `age`
  - `sumInsured`
  - `policyType`
  - `rider`
  - `premiumExpected`
- Steps JSON textarea (`stepsJson`)

### Default `stepsJson` preloaded
Includes `goto`, `fill`, `click`, and `assert` steps.

### Submit flow
1. Parse `stepsJson` using `JSON.parse`.
2. Build payload via `createTestCase(...)`.
3. On success: show `Created test case <id>`.
4. On failure: show error message.

## Frontend Validations (Current)
These are the validations currently present in code:

1. `stepsJson` must be valid JSON.
- Enforced by `JSON.parse` in submit handler.
- Invalid JSON throws and displays error.

2. Numeric coercion for insurance fields.
- `age`, `sumInsured`, `premiumExpected` are converted via `Number(...)`.
- No explicit `NaN` check.

3. No required HTML attributes are set (`required` not used).
- Empty values can be submitted from frontend; backend may reject or DB may fail.

4. No frontend schema validation for `steps[]`.
- Any JSON array/object shape is accepted client-side.

## Backend Validation Impact on Frontend
Because frontend has light validation, these backend validations are relied upon:
- `tenantId`, `name`, `appUrl`, and `steps[]` required for create
- UUID validation for IDs
- Non-empty browser list for execution route

## Known Gaps / Recommended Next Hardening
1. Add client-side schema validation (e.g., Zod) for `createTestCase` payload.
2. Add field-level validations:
- Non-empty `name`, `appUrl`
- `age >= 0`
- `sumInsured > 0`
- `premiumExpected >= 0`
3. Parse backend error JSON and display `error` field cleanly.
4. Add frontend model for full test case response instead of partial mapping.
5. Add form validation messages before submit.

