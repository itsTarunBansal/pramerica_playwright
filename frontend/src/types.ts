export type TestAction = "goto" | "click" | "fill" | "wait" | "waitForSelector" | "assert" | "check" | "select" | "press";

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
  // Login
  agentCode: string;
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
  otp5: string;
  otp6: string;
  // Proposer
  sameProposer: string;
  proposerPAN: string;
  mobileNumber: string;
  // Personal
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  // Address
  address1: string;
  address2: string;
  address3: string;
  landmark: string;
  pinCode: string;
  state: string;
  city: string;
  // Financial
  monthlyIncome: string;
  monthlyExpenses: string;
  maritalStatus: string;
  // Premium
  premiumMode: string;
  premiumChannel: string;
  premiumFrequency: string;
  planOption: string;
  premiumAmount: string;
  policyTerm: string;
  premiumPayingTerm: string;
  // Occupation
  education: string;
  occupation: string;
  natureOfDuty: string;
  employerName: string;
  employerAddress: string;
  designation: string;
  annualIncome: string;
  // Family
  spouseName: string;
  fatherName: string;
  motherName: string;
  // Nominee
  nomineeRelation: string;
  nomineeTitle: string;
  nomineeName: string;
  nomineeGender: string;
  nomineeSharePercentage: string;
  nomineeDOB: string;
  // Bank
  bankAccountNumber: string;
  ifscCode: string;
  pennyDrop: string;
  // Health
  weightKgs: string;
  heightFeet: string;
  heightInches: string;
  // Payment
  paymentUrl: string;
  fundTransferNumber: string;
}
