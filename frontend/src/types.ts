export type TestAction = "goto" | "click" | "fill" | "wait" | "assert";

export interface TestStep {
  order: number;
  action: TestAction;
  selector?: string;
  value?: string;
  timeout_ms?: number;
  expected?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

export interface InsuranceInput {
  age: number;
  sumInsured: number;
  policyType: string;
  rider?: string;
  premiumExpected?: number;
}

