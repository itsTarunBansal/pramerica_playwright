import { v4 as uuidv4 } from "uuid";
import { connectDB } from "./db.js";
import { FieldConfig } from "./models/fieldConfig.js";

const DEMO_TENANT_ID = "00000000-0000-0000-0000-000000000001";

const allFields = [
  // Login
  { fieldName: "agentCode", label: "Agent Code", section: "Login", actionType: "fill", selector: "role=textbox[name='Enter Code']", inputType: "text", defaultValue: "70016333", order: 0 },
  { fieldName: "tabPress", label: "Tab Press", section: "Login", actionType: "press", selector: "role=textbox[name='Enter Code']", inputType: "text", defaultValue: "Tab", order: 1 },
  { fieldName: "otp1", label: "OTP Digit 1", section: "Login", actionType: "fill", selector: "#agentotp1", inputType: "text", defaultValue: "1", order: 2 },
  { fieldName: "otp2", label: "OTP Digit 2", section: "Login", actionType: "fill", selector: "#agentotp2", inputType: "text", defaultValue: "2", order: 3 },
  { fieldName: "otp3", label: "OTP Digit 3", section: "Login", actionType: "fill", selector: "#agentotp3", inputType: "text", defaultValue: "3", order: 4 },
  { fieldName: "otp4", label: "OTP Digit 4", section: "Login", actionType: "fill", selector: "#agentotp4", inputType: "text", defaultValue: "1", order: 5 },
  { fieldName: "otp5", label: "OTP Digit 5", section: "Login", actionType: "fill", selector: "#agentotp5", inputType: "text", defaultValue: "2", order: 6 },
  { fieldName: "otp6", label: "OTP Digit 6", section: "Login", actionType: "fill", selector: "#agentotp6", inputType: "text", defaultValue: "3", order: 7 },
  { fieldName: "signInBtn", label: "Sign In Button", section: "Login", actionType: "click", selector: "role=button[name='Sign In']", inputType: "text", defaultValue: "click", order: 8 },
  { fieldName: "forceLoginBtn", label: "Force Login Button", section: "Login", actionType: "click", selector: "role=button[name='Yes, Force Login']", inputType: "text", defaultValue: "click", order: 9 },

  // Application Start
  { fieldName: "startAppBtn", label: "Start New Application", section: "Application", actionType: "click", selector: "role=heading[name='Start New Application']", inputType: "text", defaultValue: "click", order: 10 },
  { fieldName: "proposerPAN", label: "Proposer PAN", section: "Application", actionType: "fill", selector: "role=textbox[name='Enter Proposer PAN']", inputType: "text", defaultValue: "LLLLL9999H", order: 11 },
  { fieldName: "mobileNumber", label: "Mobile Number", section: "Application", actionType: "fill", selector: "role=textbox[name='Enter your mobile number']", inputType: "text", defaultValue: "8888888888", order: 12 },
  { fieldName: "kycCheck", label: "KYC Checkbox", section: "Application", actionType: "check", selector: "#kycckecked", inputType: "checkbox", defaultValue: "check", order: 13 },
  { fieldName: "submitBtn", label: "Submit Button", section: "Application", actionType: "click", selector: "role=button[name='Submit']", inputType: "text", defaultValue: "click", order: 14 },

  // KYC
  { fieldName: "proceedEKycBtn", label: "Proceed without e-KYC", section: "KYC", actionType: "click", selector: "role=heading[name='Proceed without e-KYC']", inputType: "text", defaultValue: "click", order: 15 },
  { fieldName: "sameProposer", label: "Same Proposer", section: "KYC", actionType: "check", selector: "#sameProposerYes", inputType: "checkbox", defaultValue: "check", order: 16 },
  { fieldName: "title", label: "Title", section: "Personal Information", actionType: "select", selector: "#kyc_Title", inputType: "select", selectOptions: ["MR", "MRS", "MS"], defaultValue: "MR", order: 17 },
  { fieldName: "wait2sec", label: "Wait 2 seconds", section: "Personal Information", actionType: "wait", selector: "", inputType: "text", defaultValue: "2000", order: 18 },
  { fieldName: "firstName", label: "First Name", section: "Personal Information", actionType: "fill", selector: "role=textbox[name='Enter First Name']", inputType: "text", defaultValue: "Testing", order: 19 },
  { fieldName: "middleName", label: "Middle Name", section: "Personal Information", actionType: "fill", selector: "role=textbox[name='Enter Middle Name']", inputType: "text", defaultValue: "Testing", order: 20 },
  { fieldName: "lastName", label: "Last Name", section: "Personal Information", actionType: "fill", selector: "role=textbox[name='Enter Last Name']", inputType: "text", defaultValue: "Testing", order: 21 },
  { fieldName: "gender", label: "Gender", section: "Personal Information", actionType: "select", selector: "#kyc_Gender", inputType: "select", selectOptions: ["Male", "Female"], defaultValue: "Male", order: 22 },
  { fieldName: "dateOfBirth", label: "Date of Birth", section: "Personal Information", actionType: "fill", selector: "role=textbox[name='DD/MM/YYYY']", inputType: "date", defaultValue: "22/10/1990", order: 23 },
  { fieldName: "email", label: "Email", section: "Personal Information", actionType: "fill", selector: "role=textbox[name='Enter E-mail ID']", inputType: "text", defaultValue: "test@pramericalife.in", order: 24 },

  // Address
  { fieldName: "address1", label: "Address Line 1", section: "Address", actionType: "fill", selector: "#kyc_TempAddress1", inputType: "text", defaultValue: "gggui", order: 25 },
  { fieldName: "address2", label: "Address Line 2", section: "Address", actionType: "fill", selector: "#kyc_TempAddress2", inputType: "text", defaultValue: "gugiuhg", order: 26 },
  { fieldName: "address3", label: "Address Line 3", section: "Address", actionType: "fill", selector: "#kyc_TempAddress3", inputType: "text", defaultValue: "huhujh", order: 27 },
  { fieldName: "landmark", label: "Landmark", section: "Address", actionType: "fill", selector: "#kyc_LandMark", inputType: "text", defaultValue: "gugiuhgju", order: 28 },
  { fieldName: "pinCode", label: "Pin Code", section: "Address", actionType: "fill", selector: "#kyc_PinCode", inputType: "text", defaultValue: "122018", order: 29 },
  { fieldName: "stateDropdown", label: "State Dropdown Click", section: "Address", actionType: "click", selector: "#select2-kyc_State-container", inputType: "text", defaultValue: "click", order: 30 },
  { fieldName: "state", label: "State", section: "Address", actionType: "fill", selector: "role=searchbox[name='Search']", inputType: "text", defaultValue: "Haryana", order: 31 },
  { fieldName: "stateEnter", label: "State Enter Press", section: "Address", actionType: "press", selector: "role=searchbox[name='Search']", inputType: "text", defaultValue: "Enter", order: 32 },
  { fieldName: "cityDropdown", label: "City Dropdown Click", section: "Address", actionType: "click", selector: "#select2-kyc_City-container", inputType: "text", defaultValue: "click", order: 33 },
  { fieldName: "city", label: "City", section: "Address", actionType: "click", selector: "role=option[name='Adampur 1- Haryana']", inputType: "text", defaultValue: "click", order: 34 },
  { fieldName: "sameAddress", label: "Same as Temp Address", section: "Address", actionType: "check", selector: "#sameAsTempAddress", inputType: "checkbox", defaultValue: "check", order: 35 },
  { fieldName: "kycCheck2", label: "KYC Checkbox 2", section: "Address", actionType: "check", selector: "#checkboxkyc2", inputType: "checkbox", defaultValue: "check", order: 36 },
  { fieldName: "sameProposer2", label: "Same Proposer 2", section: "Address", actionType: "check", selector: "#sameProposerYes", inputType: "checkbox", defaultValue: "check", order: 37 },
  { fieldName: "nextBtn1", label: "Next Button 1", section: "Address", actionType: "click", selector: "button.border-0.button-filled.ml-2.h-100 >> nth=1", inputType: "text", defaultValue: "click", order: 38 },
  { fieldName: "wait5sec", label: "Wait 5 seconds", section: "Address", actionType: "wait", selector: "", inputType: "text", defaultValue: "5000", order: 39 },
  { fieldName: "thankYouBtn", label: "Thank You Proceed Button", section: "Address", actionType: "click", selector: "role=button[name='Thank you and Proceed']", inputType: "text", defaultValue: "click", order: 40 },

  // Financial
  { fieldName: "monthlyIncome", label: "Monthly Income", section: "Financial", actionType: "fill", selector: "role=textbox[name='Enter total monthly income']", inputType: "text", defaultValue: "1,00,0000", order: 41 },
  { fieldName: "monthlyExpenses", label: "Monthly Expenses", section: "Financial", actionType: "fill", selector: "role=textbox[name='Enter total monthly expenses']", inputType: "text", defaultValue: "1,0000", order: 42 },
  { fieldName: "lifeStage", label: "Life Stage", section: "Financial", actionType: "click", selector: "#rptlifeStage_2", inputType: "text", defaultValue: "click", order: 43 },
  { fieldName: "lifeGoal", label: "Life Goal", section: "Financial", actionType: "click", selector: "#lb_lifeGoal_2", inputType: "text", defaultValue: "click", order: 44 },
  { fieldName: "riskProfile", label: "Risk Profile", section: "Financial", actionType: "click", selector: "#lb_risk_2", inputType: "text", defaultValue: "click", order: 45 },
  { fieldName: "timeHorizon", label: "Time Horizon", section: "Financial", actionType: "click", selector: "#lb_time_2", inputType: "text", defaultValue: "click", order: 46 },
  { fieldName: "wait3sec", label: "Wait 3 seconds", section: "Financial", actionType: "wait", selector: "", inputType: "text", defaultValue: "3000", order: 47 },
  { fieldName: "nextBtn2", label: "Next Button 2", section: "Financial", actionType: "click", selector: "role=button[name='Next']", inputType: "text", defaultValue: "click", order: 48 },

  // Product
  { fieldName: "wait3sec2", label: "Wait 3 seconds 2", section: "Product", actionType: "wait", selector: "", inputType: "text", defaultValue: "3000", order: 49 },
  { fieldName: "buyNowBtn", label: "Buy Now Button", section: "Product", actionType: "click", selector: "role=button[name='Buy Now'] >> nth=0", inputType: "text", defaultValue: "click", order: 50 },
  { fieldName: "dobProduct", label: "DOB in Product", section: "Product", actionType: "fill", selector: "role=textbox[name='DD/MM/YYYY']", inputType: "date", defaultValue: "22/10/1990", order: 51 },
  { fieldName: "nextBtn3", label: "Next Button 3", section: "Product", actionType: "click", selector: "role=button[name='Next']", inputType: "text", defaultValue: "click", order: 52 },
  { fieldName: "premiumMode", label: "Premium Mode", section: "Policy", actionType: "select", selector: "#dynInput_Mode", inputType: "select", selectOptions: ["1", "2", "3", "4"], defaultValue: "1", order: 53 },
  { fieldName: "policyTerm", label: "Policy Term", section: "Policy", actionType: "select", selector: "#ddlPT", inputType: "select", selectOptions: ["10", "15", "20", "25"], defaultValue: "20", order: 54 },
  { fieldName: "premiumPayingTerm", label: "Premium Paying Term", section: "Policy", actionType: "select", selector: "#ddlPPT", inputType: "select", selectOptions: ["5", "7", "9", "10"], defaultValue: "9", order: 55 },
  { fieldName: "premiumFrequency", label: "Premium Frequency", section: "Policy", actionType: "select", selector: "#dynInput_Mode", inputType: "select", selectOptions: ["1", "2", "3", "4"], defaultValue: "3", order: 56 },
  { fieldName: "premiumChannel", label: "Premium Channel", section: "Policy", actionType: "select", selector: "#dynPR_CHANNEL", inputType: "select", selectOptions: ["19"], defaultValue: "19", order: 57 },
  { fieldName: "planOption", label: "Plan Option", section: "Policy", actionType: "select", selector: "#ddlOpt0", inputType: "select", selectOptions: ["3", "4"], defaultValue: "3", order: 58 },
  { fieldName: "premiumAmount", label: "Premium Amount", section: "Policy", actionType: "fill", selector: "role=textbox[name='Premium Amount']", inputType: "text", defaultValue: "5,0000", order: 59 },
  { fieldName: "calculateBtn", label: "Calculate Button", section: "Policy", actionType: "click", selector: "role=button[name='Calculate']", inputType: "text", defaultValue: "click", order: 60 },
  { fieldName: "nextBtn4", label: "Next Button 4", section: "Policy", actionType: "click", selector: "role=button[name='Next']", inputType: "text", defaultValue: "click", order: 61 },
  { fieldName: "submitContinueBtn", label: "Submit & Continue Button", section: "Policy", actionType: "click", selector: "role=button[name='Submit & Continue']", inputType: "text", defaultValue: "click", order: 62 },

  // Occupation
  { fieldName: "education", label: "Education", section: "Occupation", actionType: "select", selector: "#Drd_Education", inputType: "select", selectOptions: ["PGA"], defaultValue: "PGA", order: 63 },
  { fieldName: "occupation", label: "Occupation", section: "Occupation", actionType: "select", selector: "#Drd_Occupation", inputType: "select", selectOptions: ["SL"], defaultValue: "SL", order: 64 },
  { fieldName: "natureOfDuty", label: "Nature of Duty", section: "Occupation", actionType: "select", selector: "#Drd_ExactNatureOfDuty", inputType: "select", selectOptions: ["MGCN"], defaultValue: "MGCN", order: 65 },
  { fieldName: "employerName", label: "Employer Name", section: "Occupation", actionType: "fill", selector: "role=textbox[name='Please Enter Employer Name']", inputType: "text", defaultValue: "", order: 66 },
  { fieldName: "employerAddress", label: "Employer Address", section: "Occupation", actionType: "fill", selector: "role=textbox[name='Please Enter Address']", inputType: "text", defaultValue: "", order: 67 },
  { fieldName: "designation", label: "Designation", section: "Occupation", actionType: "fill", selector: "role=textbox[name='Please Enter Designation']", inputType: "text", defaultValue: "", order: 68 },
  { fieldName: "nextBtn5", label: "NEXT Button 5", section: "Occupation", actionType: "click", selector: "role=button[name='NEXT']", inputType: "text", defaultValue: "click", order: 69 },

  // Family
  { fieldName: "spouseName", label: "Spouse Name", section: "Family", actionType: "fill", selector: "#Txt_SpouseNAME", inputType: "text", defaultValue: "", order: 70 },
  { fieldName: "fatherName", label: "Father Name", section: "Family", actionType: "fill", selector: "#Txt_FatherNAME", inputType: "text", defaultValue: "", order: 71 },
  { fieldName: "motherName", label: "Mother Name", section: "Family", actionType: "fill", selector: "#TxtMotherName", inputType: "text", defaultValue: "", order: 72 },

  // Nominee
  { fieldName: "wait10sec", label: "Wait 10 seconds", section: "Nominee", actionType: "wait", selector: "", inputType: "text", defaultValue: "10000", order: 73 },
  { fieldName: "nomineeRelation", label: "Nominee Relation", section: "Nominee", actionType: "select", selector: "#Drd_NomineeRelation", inputType: "select", selectOptions: ["FTR"], defaultValue: "FTR", order: 74 },
  { fieldName: "nomineeTitle", label: "Nominee Title", section: "Nominee", actionType: "select", selector: "#drd_NomineeTitle", inputType: "select", selectOptions: ["DR", "MR", "MRS"], defaultValue: "DR", order: 75 },
  { fieldName: "nomineeName", label: "Nominee Name", section: "Nominee", actionType: "fill", selector: "#Txt_NomineeName", inputType: "text", defaultValue: "", order: 76 },
  { fieldName: "wait10sec2", label: "Wait 10 seconds 2", section: "Nominee", actionType: "wait", selector: "", inputType: "text", defaultValue: "10000", order: 77 },
  { fieldName: "nomineeSharePercentage", label: "Nominee Share %", section: "Nominee", actionType: "fill", selector: "#Txt_SharePercentage", inputType: "text", defaultValue: "100", order: 78 },
  { fieldName: "nomineeDOB", label: "Nominee DOB", section: "Nominee", actionType: "fill", selector: "#Txt_NomineeDOB", inputType: "date", defaultValue: "", order: 79 },
  { fieldName: "wait30sec", label: "Wait 30 seconds", section: "Nominee", actionType: "wait", selector: "", inputType: "text", defaultValue: "30000", order: 80 },
  { fieldName: "saveNomineeBtn", label: "Save Nominee Button", section: "Nominee", actionType: "click", selector: "role=button[name='Save Nominee']", inputType: "text", defaultValue: "click", order: 81 },

  // FATCA
  { fieldName: "usPersonNo", label: "US Person - No", section: "FATCA", actionType: "click", selector: "#rad_USPerson > div > .text-center >> nth=0", inputType: "text", defaultValue: "click", order: 82 },
  { fieldName: "residentIndiaYes", label: "Resident of India - Yes", section: "FATCA", actionType: "click", selector: "#Drd_ResidentOfIndia > div:nth-child(2) > .text-center", inputType: "text", defaultValue: "click", order: 83 },

  // Bank
  { fieldName: "bankAccountNumber", label: "Bank Account Number", section: "Bank", actionType: "fill", selector: "#Txt_PayerAccNumber", inputType: "text", defaultValue: "", order: 84 },
  { fieldName: "ifscCode", label: "IFSC Code", section: "Bank", actionType: "fill", selector: "#Txt_PayerBankIFSCCode", inputType: "text", defaultValue: "", order: 85 },
  { fieldName: "wait15sec", label: "Wait 15 seconds", section: "Bank", actionType: "wait", selector: "", inputType: "text", defaultValue: "15000", order: 86 },
  { fieldName: "verifyBankDetailsBtn", label: "Verify Bank Details Button", section: "Bank", actionType: "click", selector: "role=button[name='Verify Bank Details']", inputType: "text", defaultValue: "click", order: 87 },
  { fieldName: "verifyBankOkBtn", label: "Verify Bank OK Button", section: "Bank", actionType: "click", selector: "role=button[name='OK']", inputType: "text", defaultValue: "click", order: 88 },

  // EIA
  { fieldName: "openEIANo", label: "Open EIA - No", section: "EIA", actionType: "click", selector: "#rad_OpenEIA > div > .text-center > .p-0 >> nth=0", inputType: "text", defaultValue: "click", order: 88 },
  { fieldName: "nextBtn6", label: "NEXT Button 6", section: "EIA", actionType: "click", selector: "role=button[name='NEXT']", inputType: "text", defaultValue: "click", order: 89 },

  // Health
  { fieldName: "weightKgs", label: "Weight (kg)", section: "Health", actionType: "fill", selector: "#Txt_Weight", inputType: "text", defaultValue: "", order: 90 },
  { fieldName: "heightFeet", label: "Height (feet)", section: "Health", actionType: "select", selector: "#Txt_Height_feetDrd", inputType: "select", selectOptions: ["4", "5", "6"], defaultValue: "5", order: 91 },
  { fieldName: "heightInches", label: "Height (inches)", section: "Health", actionType: "select", selector: "#Txt_Height_InchesDrd", inputType: "select", selectOptions: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"], defaultValue: "6", order: 92 },
  { fieldName: "tobaccoNo", label: "Tobacco Consumed - No", section: "Health", actionType: "click", selector: "#rad_isTobaccoConsumed > div > .text-center > .p-0 >> nth=0", inputType: "text", defaultValue: "click", order: 93 },
  { fieldName: "alcoholNo", label: "Alcohol Consumed - No", section: "Health", actionType: "click", selector: "#rad_isAlcoholConsumed > div > .text-center > .p-0 >> nth=0", inputType: "text", defaultValue: "click", order: 94 },
  { fieldName: "narcoticsNo", label: "Narcotics Consumed - No", section: "Health", actionType: "click", selector: "#rad_isNarcoticsConsumed > div > .text-center > .p-0 >> nth=0", inputType: "text", defaultValue: "click", order: 95 },
  { fieldName: "lifestyleQ1No", label: "Lifestyle Question 1 - No", section: "Health", actionType: "click", selector: "#rad_lifestyleQuest_1 > div > .text-center > .p-0 >> nth=0", inputType: "text", defaultValue: "click", order: 96 },
  { fieldName: "smq4No", label: "SMQ4 - No", section: "Health", actionType: "click", selector: "#rad_SMQ4 > div > .text-center > .p-0 >> nth=0", inputType: "text", defaultValue: "click", order: 97 },
  { fieldName: "diagnosedBefore60No", label: "Diagnosed Before 60 - No", section: "Health", actionType: "click", selector: "#Drd_DiagnosedBefore60 > div > .text-center >> nth=0", inputType: "text", defaultValue: "click", order: 98 },
  { fieldName: "prevPolicyNo", label: "Previous Policy - No", section: "Health", actionType: "click", selector: "#rad_prevpolicyQue > div > .text-center >> nth=0", inputType: "text", defaultValue: "click", order: 99 },
  { fieldName: "pepNo", label: "PEP - No", section: "Health", actionType: "click", selector: "#rad_PEP > div:nth-child(2) > .text-center", inputType: "text", defaultValue: "click", order: 100 },
  { fieldName: "smq3No", label: "SMQ3 - No", section: "Health", actionType: "click", selector: "#rad_SMQ3 > div:nth-child(2) > .text-center", inputType: "text", defaultValue: "click", order: 101 },
  { fieldName: "lmq3No", label: "LMQ3 - No", section: "Health", actionType: "click", selector: "#rad_LMQ3 > div:nth-child(2) > .text-center > .p-0", inputType: "text", defaultValue: "click", order: 102 },
  { fieldName: "smq1No", label: "SMQ1 - No", section: "Health", actionType: "click", selector: "#rad_SMQ1 > div:nth-child(2) > .text-center > .p-0", inputType: "text", defaultValue: "click", order: 103 },
  { fieldName: "smq2No", label: "SMQ2 - No", section: "Health", actionType: "click", selector: "#rad_SMQ2 > div:nth-child(2) > .text-center > .p-0", inputType: "text", defaultValue: "click", order: 104 },
  { fieldName: "nextBtn7", label: "NEXT Button 7", section: "Health", actionType: "click", selector: "role=button[name='NEXT']", inputType: "text", defaultValue: "click", order: 105 },

  // Final Submission
  { fieldName: "reviewPolicyCheck", label: "Review Policy Checkbox", section: "Final Submission", actionType: "check", selector: "role=checkbox[name='I have reviewed the policy ']", inputType: "checkbox", defaultValue: "check", order: 106 },
  { fieldName: "agreeEnrollCheck", label: "Agree & Enroll Checkbox", section: "Final Submission", actionType: "check", selector: "role=checkbox[name='I agree, confirm and enroll ']", inputType: "checkbox", defaultValue: "check", order: 107 },
  { fieldName: "medicalRadioNo", label: "Medical Radio - No", section: "Final Submission", actionType: "check", selector: "#medicalradioN", inputType: "checkbox", defaultValue: "check", order: 108 },
  { fieldName: "finalSubmitBtn", label: "Final Submit Button", section: "Final Submission", actionType: "click", selector: "role=button[name='Submit']", inputType: "text", defaultValue: "click", order: 109 },
  { fieldName: "sliderClick", label: "Slider Click", section: "Final Submission", actionType: "click", selector: ".slider", inputType: "text", defaultValue: "click", order: 110 },
  { fieldName: "finalNextBtn", label: "Final Next Button", section: "Final Submission", actionType: "click", selector: "role=button[name='Next']", inputType: "text", defaultValue: "click", order: 111 },

  // Document Upload
  { fieldName: "docUploadClick", label: "Document Upload Click", section: "Document Upload", actionType: "click", selector: "role=textbox[name='Please Select Document']", inputType: "text", defaultValue: "click", order: 112 },
  { fieldName: "docUploadFile", label: "Document Upload File", section: "Document Upload", actionType: "uploadFile", selector: "role=textbox[name='Please Select Document']", inputType: "text", defaultValue: "Screenshot (1).png", order: 113 },
  { fieldName: "docUploadOk", label: "Document Upload OK", section: "Document Upload", actionType: "click", selector: "role=button[name='OK']", inputType: "text", defaultValue: "click", order: 114 },
  { fieldName: "agreeReceiveCheck", label: "Agree to Receive Checkbox", section: "Document Upload", actionType: "check", selector: "role=checkbox[name='I agree, to receive any form ']", inputType: "checkbox", defaultValue: "check", order: 115 },
  { fieldName: "docNextBtn", label: "Next Button (Doc)", section: "Document Upload", actionType: "click", selector: "role=button[name='Next']", inputType: "text", defaultValue: "click", order: 116 },
  { fieldName: "confirmBtn", label: "Confirm Button", section: "Document Upload", actionType: "click", selector: "role=button[name='Confirm']", inputType: "text", defaultValue: "click", order: 117 },
  { fieldName: "docNextBtn2", label: "Next Button (Doc 2)", section: "Document Upload", actionType: "click", selector: "role=button[name='Next']", inputType: "text", defaultValue: "click", order: 118 },
  { fieldName: "digitalToggleYes", label: "Digital Toggle Yes", section: "Document Upload", actionType: "click", selector: "#digitaltoggle >> text=Yes", inputType: "text", defaultValue: "click", order: 119 },
  { fieldName: "physicalBtn", label: "Physical Button", section: "Document Upload", actionType: "click", selector: "role=button[name='PHYSICAL']", inputType: "text", defaultValue: "click", order: 120 },
  { fieldName: "physicalToggleYes", label: "Physical Toggle Yes", section: "Document Upload", actionType: "click", selector: "#physicaltoggle >> text=Yes", inputType: "text", defaultValue: "click", order: 121 },
  { fieldName: "viewDownloadBtn", label: "View and Download Button", section: "Document Upload", actionType: "click", selector: "role=button[name='View and Download']", inputType: "text", defaultValue: "click", order: 122 },
  { fieldName: "closeBtn", label: "Close Button", section: "Document Upload", actionType: "click", selector: "role=button[name='Close']", inputType: "text", defaultValue: "click", order: 123 },
  { fieldName: "docNextBtn3", label: "NEXT Button (Doc 3)", section: "Document Upload", actionType: "click", selector: "role=button[name='NEXT']", inputType: "text", defaultValue: "click", order: 124 },

  // Payment
  { fieldName: "paymentUrl", label: "Payment URL", section: "Payment", actionType: "goto", selector: "", inputType: "text", defaultValue: "", order: 125 },
  { fieldName: "fundTransferBtn", label: "Fund Transfer Button", section: "Payment", actionType: "click", selector: "role=button[name='Fund Transfer']", inputType: "text", defaultValue: "click", order: 126 },
  { fieldName: "fundTransferNumber", label: "Fund Transfer Number", section: "Payment", actionType: "fill", selector: "role=textbox[name='Enter Transfer Number']", inputType: "text", defaultValue: "", order: 127 },
  { fieldName: "fundTransferNext", label: "Fund Transfer Next", section: "Payment", actionType: "click", selector: "role=group[name='Fund Transfer'] >> role=button[name='Next']", inputType: "text", defaultValue: "click", order: 128 },
  { fieldName: "paymentNextBtn", label: "Payment Next Button", section: "Payment", actionType: "click", selector: "role=button[name='Next']", inputType: "text", defaultValue: "click", order: 129 },

  // KYC Documents
  { fieldName: "identityProof", label: "Identity Proof", section: "KYC Documents", actionType: "select", selector: "#drd_IdentityProof", inputType: "select", selectOptions: ["LUIDAI"], defaultValue: "LUIDAI", order: 130 },
  { fieldName: "last4Digits", label: "Last 4 Digits", section: "KYC Documents", actionType: "fill", selector: "role=textbox[name='Please Enter Last 4 Digits']", inputType: "text", defaultValue: "1234", order: 131 },
  { fieldName: "fileInput104Click", label: "Identity Proof Upload Click", section: "KYC Documents", actionType: "click", selector: "#fileInput_104", inputType: "text", defaultValue: "click", order: 132 },
  { fieldName: "fileInput104", label: "Identity Proof Upload", section: "KYC Documents", actionType: "uploadFile", selector: "#fileInput_104", inputType: "text", defaultValue: "Screenshot (1).png", order: 133 },
  { fieldName: "fileInput104Ok", label: "Identity Proof OK", section: "KYC Documents", actionType: "click", selector: "role=button[name='OK']", inputType: "text", defaultValue: "click", order: 134 },
  { fieldName: "addressProof", label: "Address Proof", section: "KYC Documents", actionType: "select", selector: "#drd_AddressProof", inputType: "select", selectOptions: ["LUIDAI"], defaultValue: "LUIDAI", order: 135 },
  { fieldName: "fileInput302Click", label: "Address Proof Upload Click", section: "KYC Documents", actionType: "click", selector: "#fileInput_302", inputType: "text", defaultValue: "click", order: 136 },
  { fieldName: "fileInput302", label: "Address Proof Upload", section: "KYC Documents", actionType: "uploadFile", selector: "#fileInput_302", inputType: "text", defaultValue: "Screenshot (1).png", order: 137 },
  { fieldName: "fileInput302Ok", label: "Address Proof OK", section: "KYC Documents", actionType: "click", selector: "role=button[name='OK']", inputType: "text", defaultValue: "click", order: 138 },
  { fieldName: "fileInput309Click", label: "Document 3 Upload Click", section: "KYC Documents", actionType: "click", selector: "#fileInput_309", inputType: "text", defaultValue: "click", order: 139 },
  { fieldName: "fileInput309", label: "Document 3 Upload", section: "KYC Documents", actionType: "uploadFile", selector: "#fileInput_309", inputType: "text", defaultValue: "Screenshot (1).png", order: 140 },
  { fieldName: "fileInput309Ok", label: "Document 3 OK", section: "KYC Documents", actionType: "click", selector: "role=button[name='OK']", inputType: "text", defaultValue: "click", order: 141 },
  { fieldName: "fileInput312Click", label: "Document 4 Upload Click", section: "KYC Documents", actionType: "click", selector: "#fileInput_312", inputType: "text", defaultValue: "click", order: 142 },
  { fieldName: "fileInput312", label: "Document 4 Upload", section: "KYC Documents", actionType: "uploadFile", selector: "#fileInput_312", inputType: "text", defaultValue: "Screenshot (1).png", order: 143 },
  { fieldName: "fileInput312Ok", label: "Document 4 OK", section: "KYC Documents", actionType: "click", selector: "role=button[name='OK']", inputType: "text", defaultValue: "click", order: 144 },
  { fieldName: "confirmAllCheck", label: "Confirm All Checkbox", section: "KYC Documents", actionType: "check", selector: "role=checkbox[name='I confirm that all the ']", inputType: "checkbox", defaultValue: "check", order: 145 },
  { fieldName: "kycDocNextBtn", label: "NEXT Button (KYC Docs)", section: "KYC Documents", actionType: "click", selector: "role=button[name='NEXT']", inputType: "text", defaultValue: "click", order: 146 },
  { fieldName: "declareCheck", label: "Declaration Checkbox", section: "KYC Documents", actionType: "check", selector: "#declare", inputType: "checkbox", defaultValue: "check", order: 147 },
  { fieldName: "finalKycSubmitBtn", label: "Final KYC Submit Button", section: "KYC Documents", actionType: "click", selector: "role=button[name='Submit']", inputType: "text", defaultValue: "click", order: 148 },
  { fieldName: "appSuccessClick", label: "Application Successful Click", section: "KYC Documents", actionType: "click", selector: "#ApplicationSuccessfull", inputType: "text", defaultValue: "click", order: 149 },
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
    console.log(`✅ Seeded ${fields.length} field configurations (Complete test flow with all buttons and navigation)`);
    console.log("📋 Includes: Login, Navigation, Forms, Buttons, Waits, Checks, and Final Submission");
    console.log("🎯 All steps are now manageable through Field Manager with drag & drop support");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seedFieldConfigs();
