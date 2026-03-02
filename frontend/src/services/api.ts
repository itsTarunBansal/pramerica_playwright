import type { InsuranceInput, TestStep } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const DEMO_TENANT_ID = "00000000-0000-0000-0000-000000000001";

async function buildApiError(response: Response, fallback: string): Promise<Error> {
  try {
    const payload = await response.json();
    if (payload && typeof payload.error === "string") {
      return new Error(payload.error);
    }
  } catch {
    // Non-JSON error body fallback below.
  }

  try {
    const text = await response.text();
    if (text) {
      return new Error(text);
    }
  } catch {
    // Ignore and return fallback.
  }
  return new Error(fallback);
}

export async function getHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_URL}/api/v1/health`);
  if (!response.ok) {
    throw await buildApiError(response, "Health check failed");
  }
  return response.json();
}

export async function listTestCases(): Promise<Array<{ id: string; name: string; appUrl: string }>> {
  const response = await fetch(`${API_URL}/api/v1/test-cases`);
  if (!response.ok) {
    throw await buildApiError(response, "Failed to list test cases");
  }
  const payload = await response.json();
  return payload.map((item: any) => ({
    id: item.id,
    name: item.name,
    appUrl: item.appUrl
  }));
}

export async function createTestCase(input: {
  name: string;
  appUrl: string;
  insuranceInput: InsuranceInput;
  steps: TestStep[];
}) {
  const response = await fetch(`${API_URL}/api/v1/test-cases/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ...input,
      tenantId: DEMO_TENANT_ID
    })
  });

  if (!response.ok) {
    throw await buildApiError(response, "Failed to create test case");
  }
  return response.json();
}
