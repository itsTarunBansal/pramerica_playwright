import { v4 as uuidv4 } from "uuid";
import { connectDB } from "./db.js";
import { FieldConfig } from "./models/fieldConfig.js";

const DEMO_TENANT_ID = "00000000-0000-0000-0000-000000000001";

const allFields = [
  // Login
  { fieldName: "agentCode", label: "Agent Code", section: "Login", actionType: "fill", selector: "role=textbox[name='Enter Code']", inputType: "text", defaultValue: "70016333", order: 0 },
  { fieldName: "otp1", label: "OTP Digit 1", section: "Login", actionType: "fill", selector: "#agentotp1", inputType: "text", defaultValue: "1", order: 1 },
  { fieldName: "otp2", label: "OTP Digit 2", section: "Login", actionType: "fill", selector: "#agentotp2", inputType: "text", defaultValue: "2", order: 2 },
  { fieldName: "otp3", label: "OTP Digit 3", section: "Login", actionType: "fill", selector: "#agentotp3", inputType: "text", defaultValue: "3", order: 3 },
  { fieldName: "otp4", label: "OTP Digit 4", section: "Login", actionType: "fill", selector: "#agentotp4", inputType: "text", defaultValue: "1", order: 4 },
  { fieldName: "otp5", label: "OTP Digit 5", section: "Login", actionType: "fill", selector: "#agentotp5", inputType: "text", defaultValue: "2", order: 5 },
  { fieldName: "otp6", label: "OTP Digit 6", section: "Login", actionType: "fill", selector: "#agentotp6", inputType: "text", defaultValue: "3", order: 6 },
  
  // Application Start
  { fieldName: "proposerPAN", label: "Proposer PAN", section: "Application", actionType: "fill", selector: "role=textbox[name='Enter Proposer PAN']", inputType: "text", defaultValue: "LLLLL9999H", order: 7 },
  { fieldName: "mobileNumber", label: "Mobile Number", section: "Application", actionType: "fill", selector: "role=textbox[name='Enter your mobile number']", inputType: "text", defaultValue: "8888888888", order: 8 },
  { fieldName: "sameProposer", label: "Same Proposer", section: "Application", actionType: "check", selector: "#sameProposerYes", inputType: "checkbox", defaultValue: "Yes", order: 9 },
  
  // Personal Information
  { fieldName: "title", label: "Title", section: "Personal Information", actionType: "select", selector: "#kyc_Title", inputType: "select", selectOptions: ["MR", "MRS", "MS"], defaultValue: "MR", order: 10 },
  { fieldName: "firstName", label: "First Name", section: "Personal Information", actionType: "fill", selector: "role=textbox[name='Enter First Name']", inputType: "text", defaultValue: "Testing", order: 11 },
  { fieldName: "middleName", label: "Middle Name", section: "Personal Information", actionType: "fill", selector: "role=textbox[name='Enter Middle Name']", inputType: "text", defaultValue: "Testing", order: 12 },
  { fieldName: "lastName", label: "Last Name", section: "Personal Information", actionType: "fill", selector: "role=textbox[name='Enter Last Name']", inputType: "text", defaultValue: "Testing", order: 13 },
  { fieldName: "gender", label: "Gender", section: "Personal Information", actionType: "select", selector: "#kyc_Gender", inputType: "select", selectOptions: ["Male", "Female"], defaultValue: "Male", order: 14 },
  { fieldName: "dateOfBirth", label: "Date of Birth", section: "Personal Information", actionType: "fill", selector: "role=textbox[name='DD/MM/YYYY']", inputType: "date", defaultValue: "22/10/1990", order: 15 },
  { fieldName: "email", label: "Email", section: "Personal Information", actionType: "fill", selector: "role=textbox[name='Enter E-mail ID']", inputType: "text", defaultValue: "test@pramericalife.in", order: 16 },
  { fieldName: "maritalStatus", label: "Marital Status", section: "Personal Information", actionType: "select", selector: "#maritalStatus", inputType: "select", selectOptions: ["married", "single"], defaultValue: "married", order: 17 },
  
  // Address
  { fieldName: "address1", label: "Address Line 1", section: "Address", actionType: "fill", selector: "#kyc_TempAddress1", inputType: "text", defaultValue: "gggui", order: 18 },
  { fieldName: "address2", label: "Address Line 2", section: "Address", actionType: "fill", selector: "#kyc_TempAddress2", inputType: "text", defaultValue: "gugiuhg", order: 19 },
  { fieldName: "address3", label: "Address Line 3", section: "Address", actionType: "fill", selector: "#kyc_TempAddress3", inputType: "text", defaultValue: "huhujh", order: 20 },
  { fieldName: "landmark", label: "Landmark", section: "Address", actionType: "fill", selector: "#kyc_LandMark", inputType: "text", defaultValue: "gugiuhgju", order: 21 },
  { fieldName: "pinCode", label: "Pin Code", section: "Address", actionType: "fill", selector: "#kyc_PinCode", inputType: "text", defaultValue: "122018", order: 22 },
  { fieldName: "state", label: "State", section: "Address", actionType: "fill", selector: "role=searchbox[name='Search']", inputType: "text", defaultValue: "Haryana", order: 23 },
  { fieldName: "city", label: "City", section: "Address", actionType: "click", selector: "role=option[name='Adampur 1- Haryana']", inputType: "text", defaultValue: "Adampur 1- Haryana", order: 24 },
  
  // Financial
  { fieldName: "monthlyIncome", label: "Monthly Income", section: "Financial", actionType: "fill", selector: "role=textbox[name='Enter total monthly income']", inputType: "text", defaultValue: "1,00,0000", order: 25 },
  { fieldName: "monthlyExpenses", label: "Monthly Expenses", section: "Financial", actionType: "fill", selector: "role=textbox[name='Enter total monthly expenses']", inputType: "text", defaultValue: "1,0000", order: 26 },
  { fieldName: "annualIncome", label: "Annual Income", section: "Financial", actionType: "fill", selector: "#annualIncome", inputType: "text", defaultValue: "", order: 27 },
  
  // Policy Details
  { fieldName: "premiumMode", label: "Premium Mode", section: "Policy", actionType: "select", selector: "#dynInput_Mode", inputType: "select", selectOptions: ["1", "2", "3", "4"], defaultValue: "1", order: 28 },
  { fieldName: "policyTerm", label: "Policy Term", section: "Policy", actionType: "select", selector: "#ddlPT", inputType: "select", selectOptions: ["10", "15", "20", "25"], defaultValue: "20", order: 29 },
  { fieldName: "premiumPayingTerm", label: "Premium Paying Term", section: "Policy", actionType: "select", selector: "#ddlPPT", inputType: "select", selectOptions: ["5", "7", "9", "10"], defaultValue: "9", order: 30 },
  { fieldName: "premiumFrequency", label: "Premium Frequency", section: "Policy", actionType: "select", selector: "#dynInput_Mode", inputType: "select", selectOptions: ["1", "2", "3", "4"], defaultValue: "3", order: 31 },
  { fieldName: "premiumChannel", label: "Premium Channel", section: "Policy", actionType: "select", selector: "#dynPR_CHANNEL", inputType: "select", selectOptions: ["19"], defaultValue: "19", order: 32 },
  { fieldName: "planOption", label: "Plan Option", section: "Policy", actionType: "select", selector: "#ddlOpt0", inputType: "select", selectOptions: ["3", "4"], defaultValue: "3", order: 33 },
  { fieldName: "premiumAmount", label: "Premium Amount", section: "Policy", actionType: "fill", selector: "role=textbox[name='Premium Amount']", inputType: "text", defaultValue: "5,0000", order: 34 },
  
  // Occupation
  { fieldName: "education", label: "Education", section: "Occupation", actionType: "select", selector: "#Drd_Education", inputType: "select", selectOptions: ["PGA"], defaultValue: "PGA", order: 35 },
  { fieldName: "occupation", label: "Occupation", section: "Occupation", actionType: "select", selector: "#Drd_Occupation", inputType: "select", selectOptions: ["SL"], defaultValue: "SL", order: 36 },
  { fieldName: "natureOfDuty", label: "Nature of Duty", section: "Occupation", actionType: "select", selector: "#Drd_ExactNatureOfDuty", inputType: "select", selectOptions: ["MGCN"], defaultValue: "MGCN", order: 37 },
  { fieldName: "employerName", label: "Employer Name", section: "Occupation", actionType: "fill", selector: "role=textbox[name='Please Enter Employer Name']", inputType: "text", defaultValue: "", order: 38 },
  { fieldName: "employerAddress", label: "Employer Address", section: "Occupation", actionType: "fill", selector: "role=textbox[name='Please Enter Address']", inputType: "text", defaultValue: "", order: 39 },
  { fieldName: "designation", label: "Designation", section: "Occupation", actionType: "fill", selector: "role=textbox[name='Please Enter Designation']", inputType: "text", defaultValue: "", order: 40 },
  
  // Family
  { fieldName: "spouseName", label: "Spouse Name", section: "Family", actionType: "fill", selector: "#Txt_SpouseNAME", inputType: "text", defaultValue: "", order: 41 },
  { fieldName: "fatherName", label: "Father Name", section: "Family", actionType: "fill", selector: "#Txt_FatherNAME", inputType: "text", defaultValue: "", order: 42 },
  { fieldName: "motherName", label: "Mother Name", section: "Family", actionType: "fill", selector: "#TxtMotherName", inputType: "text", defaultValue: "", order: 43 },
  
  // Nominee
  { fieldName: "nomineeRelation", label: "Nominee Relation", section: "Nominee", actionType: "select", selector: "#Drd_NomineeRelation", inputType: "select", selectOptions: ["FTR"], defaultValue: "FTR", order: 44 },
  { fieldName: "nomineeTitle", label: "Nominee Title", section: "Nominee", actionType: "select", selector: "#drd_NomineeTitle", inputType: "select", selectOptions: ["DR", "MR", "MRS"], defaultValue: "DR", order: 45 },
  { fieldName: "nomineeName", label: "Nominee Name", section: "Nominee", actionType: "fill", selector: "role=textbox", inputType: "text", defaultValue: "", order: 46 },
  { fieldName: "nomineeGender", label: "Nominee Gender", section: "Nominee", actionType: "select", selector: "#nomineeGender", inputType: "select", selectOptions: ["Male", "Female"], defaultValue: "Male", order: 47 },
  { fieldName: "nomineeSharePercentage", label: "Nominee Share %", section: "Nominee", actionType: "fill", selector: "role=textbox", inputType: "text", defaultValue: "100", order: 48 },
  { fieldName: "nomineeDOB", label: "Nominee DOB", section: "Nominee", actionType: "fill", selector: "role=textbox[name='DD/MM/YYYY']", inputType: "date", defaultValue: "", order: 49 },
  
  // Bank
  { fieldName: "bankAccountNumber", label: "Bank Account Number", section: "Bank", actionType: "fill", selector: "role=textbox[name='Please Enter Account number']", inputType: "text", defaultValue: "", order: 50 },
  { fieldName: "ifscCode", label: "IFSC Code", section: "Bank", actionType: "fill", selector: "role=textbox[name='Please Enter IFSC code']", inputType: "text", defaultValue: "", order: 51 },
  
  // Health
  { fieldName: "weightKgs", label: "Weight (kg)", section: "Health", actionType: "fill", selector: "role=textbox[name='Please Enter Weight (kgs)']", inputType: "text", defaultValue: "", order: 52 },
  { fieldName: "heightFeet", label: "Height (feet)", section: "Health", actionType: "select", selector: "#Txt_Height_feetDrd", inputType: "select", selectOptions: ["4", "5", "6"], defaultValue: "5", order: 53 },
  { fieldName: "heightInches", label: "Height (inches)", section: "Health", actionType: "select", selector: "#Txt_Height_InchesDrd", inputType: "select", selectOptions: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"], defaultValue: "6", order: 54 },
];

async function seedFieldConfigs() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    await FieldConfig.deleteMany({ tenantId: DEMO_TENANT_ID });
    console.log("Cleared existing field configs");

    const fields = allFields.map(f => ({
      id: uuidv4(),
      tenantId: DEMO_TENANT_ID,
      ...f,
      isRequired: false,
      isActive: true
    }));

    await FieldConfig.insertMany(fields);
    console.log(`✅ Seeded ${fields.length} field configurations (ALL static fields included)`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seedFieldConfigs();
