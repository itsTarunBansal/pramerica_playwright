import type { InsuranceInput, TestStep } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const DEMO_TENANT_ID = "00000000-0000-0000-0000-000000000001";

async function buildApiError(response: Response, fallback: string): Promise<Error> {
  try {
    const payload = await response.json();
    if (payload && typeof payload.error === "string") return new Error(payload.error);
  } catch {}
  try {
    const text = await response.text();
    if (text) return new Error(text);
  } catch {}
  return new Error(fallback);
}

export async function getHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_URL}/api/v1/health`);
  if (!response.ok) throw await buildApiError(response, "Health check failed");
  return response.json();
}

export async function listTestCases(): Promise<Array<{ id: string; name: string; appUrl: string }>> {
  const response = await fetch(`${API_URL}/api/v1/test-cases`);
  if (!response.ok) throw await buildApiError(response, "Failed to list test cases");
  const payload = await response.json();
  return payload.map((item: any) => ({ id: item.id, name: item.name, appUrl: item.appUrl }));
}

export async function runTestCases(testCases: object[]): Promise<{ results: Array<{ testCaseId: number; agentCode: string; proposerPAN: string; firstName: string; lastName: string; applicationNumber: string; status: string; error: string | null }> }> {
  const response = await fetch(`${API_URL}/api/v1/run-tests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ testCases }),
  });
  if (!response.ok) throw await buildApiError(response, "Failed to run test cases");
  return response.json();
}

export async function createTestCase(input: {
  name: string;
  appUrl: string;
  insuranceInput: InsuranceInput;
  steps: TestStep[];
  tenantId?: string;
}) {
  const response = await fetch(`${API_URL}/api/v1/test-cases/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tenantId: DEMO_TENANT_ID, ...input }),
  });
  if (!response.ok) throw await buildApiError(response, "Failed to create test case");
  return response.json();
}

export async function getFieldConfigs(tenantId?: string) {
  const tid = tenantId || DEMO_TENANT_ID;
  const response = await fetch(`${API_URL}/api/v1/field-configs?tenantId=${tid}`);
  if (!response.ok) throw await buildApiError(response, "Failed to fetch field configs");
  return response.json();
}

export async function createFieldConfig(data: any) {
  const payload = { ...data };
  if (!payload.tenantId) payload.tenantId = DEMO_TENANT_ID;
  const response = await fetch(`${API_URL}/api/v1/field-configs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw await buildApiError(response, "Failed to create field config");
  return response.json();
}

export async function updateFieldConfig(id: string, data: any) {
  const response = await fetch(`${API_URL}/api/v1/field-configs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw await buildApiError(response, "Failed to update field config");
  return response.json();
}

export async function deleteFieldConfig(id: string) {
  const response = await fetch(`${API_URL}/api/v1/field-configs/${id}`, { method: "DELETE" });
  if (!response.ok) throw await buildApiError(response, "Failed to delete field config");
  return response.json();
}

export async function reorderFieldConfigs(fieldIds: string[]) {
  const response = await fetch(`${API_URL}/api/v1/field-configs/reorder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fieldIds }),
  });
  if (!response.ok) throw await buildApiError(response, "Failed to reorder fields");
  return response.json();
}

// ── Projects ──
export async function getProjects(): Promise<Array<{ id: string; name: string; url: string }>> {
  const response = await fetch(`${API_URL}/api/v1/projects`);
  if (!response.ok) throw await buildApiError(response, "Failed to fetch projects");
  return response.json();
}

export async function getProject(id: string): Promise<{ id: string; name: string; url: string }> {
  const response = await fetch(`${API_URL}/api/v1/projects/${id}`);
  if (!response.ok) throw await buildApiError(response, "Failed to fetch project");
  return response.json();
}

export async function createProject(data: { name: string; url: string }): Promise<{ id: string; name: string; url: string }> {
  const response = await fetch(`${API_URL}/api/v1/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw await buildApiError(response, "Failed to create project");
  return response.json();
}

export async function updateProject(id: string, data: { url?: string; name?: string }) {
  const response = await fetch(`${API_URL}/api/v1/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw await buildApiError(response, "Failed to update project");
  return response.json();
}

export async function deleteProject(id: string) {
  const response = await fetch(`${API_URL}/api/v1/projects/${id}`, { method: "DELETE" });
  if (!response.ok) throw await buildApiError(response, "Failed to delete project");
  return response.json();
}

export async function startRecording(projectId: string, clearExisting = false): Promise<{ status: string; message: string }> {
  const response = await fetch(`${API_URL}/api/v1/projects/${projectId}/record/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clearExisting })
  });
  if (!response.ok) throw await buildApiError(response, "Failed to start recording");
  return response.json();
}

export async function stopRecording(projectId: string): Promise<{ message: string; fieldCount: number }> {
  const response = await fetch(`${API_URL}/api/v1/projects/${projectId}/record/stop`, {
    method: "POST"
  });
  if (!response.ok) throw await buildApiError(response, "Failed to stop recording");
  return response.json();
}
