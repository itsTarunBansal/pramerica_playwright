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

export interface PramericaTestData {
  agentCode: string;
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
  otp5: string;
  otp6: string;
  proposerPAN: string;
  mobileNumber: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  address1: string;
  address2: string;
  address3: string;
  landmark: string;
  pinCode: string;
  state: string;
  city: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  maritalStatus: string;
  premiumMode: string;
  premiumChannel: string;
  premiumFrequency: string;
  premiumAmount: string;
}

