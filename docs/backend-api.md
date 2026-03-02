# Backend API Documentation (Express)

This document describes the current backend behavior implemented in `backend/src`.

## Base Configuration
- Base URL: `http://localhost:8000`
- API prefix: `/api/v1`
- Content type: `application/json`
- JSON body limit: `2mb`
- CORS: allowed origins from `CORS_ORIGINS` (comma-separated env var), credentials enabled
- Default global error format:
```json
{
  "error": "message"
}
```

## Environment Variables
- `PORT` (default: `8000`)
- `DATABASE_URL` (default: `postgres://aitc:aitc@localhost:5432/aitc`)
- `CORS_ORIGINS` (default: `http://localhost:5173`)
- `APP_ENV` or `NODE_ENV` (default: `development`)

## Startup Behavior
- On startup, backend checks DB connectivity (`SELECT 1`).
- Seeds demo tenant if missing:
  - `tenant_id`: `00000000-0000-0000-0000-000000000001`
  - `name`: `Demo Insurance Tenant`

## Data Model (Current Migration)
Tables created by `backend/migrations/001_initial.sql`:
- `tenants`
- `users`
- `test_cases`
- `executions`

Important DB constraints affecting API behavior:
- UUID column types on `id`, `tenant_id`, `test_case_id`, `created_by`
- `test_cases.name` and `test_cases.app_url` are `NOT NULL`
- `test_cases.steps` is `JSONB NOT NULL`
- `executions.browser` and `executions.status` are `NOT NULL`
- Foreign keys:
  - `test_cases.tenant_id -> tenants.id`
  - `test_cases.created_by -> users.id`
  - `executions.tenant_id -> tenants.id`
  - `executions.test_case_id -> test_cases.id`

## Endpoint: `GET /`
Health-like root endpoint.

Response `200`:
```json
{
  "service": "AI Insurance Test Copilot API",
  "status": "running"
}
```

## Endpoint: `GET /api/v1/health`
System health endpoint.

Response `200`:
```json
{
  "status": "ok"
}
```

## Endpoint: `POST /api/v1/test-cases/`
Creates a test case.

### Request Payload
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
    { "order": 1, "action": "goto", "value": "https://example-insurance-app.com/quote" },
    { "order": 2, "action": "fill", "selector": "#age", "value": "35" }
  ],
  "createdBy": "11111111-1111-1111-1111-111111111111"
}
```

### Validation Rules Applied in Code
- Required: `tenantId`, `name`, `appUrl`, `steps`
- `steps` must be an array (`Array.isArray`)
- `tenantId` must be valid UUID format

### Validation/Constraint Gaps (Current Behavior)
- No strict schema validation for `insuranceInput` shape
- No strict schema validation for each `steps[]` object
- `createdBy` is not UUID-validated in code
- `name`/`appUrl` empty string is not explicitly blocked by route logic

### Error Responses
`400` when required fields missing or wrong type:
```json
{
  "error": "tenantId, name, appUrl, and steps[] are required"
}
```

`400` when `tenantId` is not UUID:
```json
{
  "error": "tenantId must be a UUID"
}
```

`500` for DB errors (FK violations, invalid UUID cast in DB, etc.):
```json
{
  "error": "..."
}
```

### Success Response
Status: `201`
```json
{
  "id": "a2e2c7ca-8a6a-4e6e-9d3f-0e6f2b89c8fd",
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
    { "order": 1, "action": "goto", "value": "https://example-insurance-app.com/quote" },
    { "order": 2, "action": "fill", "selector": "#age", "value": "35" }
  ],
  "createdBy": null,
  "createdAt": "2026-02-27T09:20:31.862Z"
}
```

## Endpoint: `GET /api/v1/test-cases`
Returns all test cases ordered by `created_at DESC`.

Request body: none

Response `200`:
```json
[
  {
    "id": "a2e2c7ca-8a6a-4e6e-9d3f-0e6f2b89c8fd",
    "tenantId": "00000000-0000-0000-0000-000000000001",
    "name": "Insurance Premium Validation",
    "appUrl": "https://example-insurance-app.com",
    "insuranceInput": { "age": 35, "sumInsured": 1000000, "policyType": "Term" },
    "steps": [],
    "createdBy": null,
    "createdAt": "2026-02-27T09:20:31.862Z"
  }
]
```

Current behavior notes:
- No pagination
- No tenant filter in route

## Endpoint: `GET /api/v1/test-cases/:testCaseId`
Returns one test case by ID.

### Path Validation
- `testCaseId` must be valid UUID

### Error Responses
`400` invalid UUID:
```json
{
  "error": "testCaseId must be a UUID"
}
```

`404` not found:
```json
{
  "error": "Test case not found"
}
```

### Success Response
Status: `200`
```json
{
  "id": "a2e2c7ca-8a6a-4e6e-9d3f-0e6f2b89c8fd",
  "tenantId": "00000000-0000-0000-0000-000000000001",
  "name": "Insurance Premium Validation",
  "appUrl": "https://example-insurance-app.com",
  "insuranceInput": { "age": 35, "sumInsured": 1000000, "policyType": "Term" },
  "steps": [],
  "createdBy": null,
  "createdAt": "2026-02-27T09:20:31.862Z"
}
```

## Endpoint: `POST /api/v1/executions/run`
Creates queued execution records for each browser in the input array.

### Request Payload
```json
{
  "tenantId": "00000000-0000-0000-0000-000000000001",
  "testCaseId": "a2e2c7ca-8a6a-4e6e-9d3f-0e6f2b89c8fd",
  "browsers": ["chromium", "firefox", "webkit"]
}
```

`browsers` defaults to:
```json
["chromium", "firefox", "webkit"]
```

### Validation Rules Applied in Code
- Required: `tenantId`, `testCaseId`
- Both must be valid UUID
- `browsers` must be a non-empty array

### Validation/Constraint Gaps (Current Behavior)
- Browser values are not enum-validated (any string accepted)
- No deduplication of browsers

### Error Responses
`400` missing required fields:
```json
{
  "error": "tenantId and testCaseId are required"
}
```

`400` invalid UUIDs:
```json
{
  "error": "tenantId and testCaseId must be UUIDs"
}
```

`400` invalid browsers:
```json
{
  "error": "browsers must be a non-empty array"
}
```

`500` DB/FK errors:
```json
{
  "error": "..."
}
```

### Success Response
Status: `201`
```json
[
  {
    "id": "2a68f31b-6d2e-4a9b-a2f4-76d8be664708",
    "tenantId": "00000000-0000-0000-0000-000000000001",
    "testCaseId": "a2e2c7ca-8a6a-4e6e-9d3f-0e6f2b89c8fd",
    "browser": "chromium",
    "status": "queued",
    "startedAt": "2026-02-27T09:22:01.300Z",
    "finishedAt": null
  }
]
```

## Error Handling Summary
- Route-level validation errors return `400` with `{ "error": "..." }`
- Not found in single test case endpoint returns `404`
- Unexpected errors return `500` via global error middleware

## Current Contract Conventions
- API outputs camelCase keys (`tenantId`, `appUrl`, `createdAt`)
- Database stores snake_case columns
- IDs are UUID strings
- Timestamps are ISO datetime strings

