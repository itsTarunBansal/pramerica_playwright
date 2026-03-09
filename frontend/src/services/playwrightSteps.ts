import type { PramericaTestData } from "../types";

const FALLBACK_URL = "https://nvestuat.pramericalife.in/Life/Login.html";

export function buildSteps(d: PramericaTestData, baseUrl?: string) {
  const otpSteps = [d.otp1, d.otp2, d.otp3, d.otp4, d.otp5, d.otp6].map((v, i) => ({
    action: "fill", selector: `#agentotp${i + 1}`, value: v,
  }));

  return [
    // Login
    { action: "goto", value: baseUrl || FALLBACK_URL },
    { action: "fill", selector: "role=textbox[name='Enter Code']", value: d.agentCode },
    { action: "press", selector: "role=textbox[name='Enter Code']", value: "Tab" },
    ...otpSteps,
    { action: "click", selector: "role=button[name='Sign In']" },
    { action: "click", selector: "role=button[name='Yes, Force Login']" },

    // Start Application
    { action: "click", selector: "role=heading[name='Start New Application']" },
    { action: "fill", selector: "role=textbox[name='Enter Proposer PAN']", value: d.proposerPAN },
    { action: "fill", selector: "role=textbox[name='Enter your mobile number']", value: d.mobileNumber },
    { action: "check", selector: "#kycckecked" },
    { action: "click", selector: "role=button[name='Submit']" },

    // KYC
    { action: "click", selector: "role=heading[name='Proceed without e-KYC']" },
    { action: "check", selector: "#sameProposerYes" },
    { action: "select", selector: "#kyc_Title", value: d.title },
    { action: "wait", value: "2000" },
    { action: "fill", selector: "role=textbox[name='Enter First Name']", value: d.firstName },
    { action: "fill", selector: "role=textbox[name='Enter Middle Name']", value: d.middleName },
    { action: "fill", selector: "role=textbox[name='Enter Last Name']", value: d.lastName },
    { action: "select", selector: "#kyc_Gender", value: d.gender },
    { action: "fill", selector: "role=textbox[name='DD/MM/YYYY']", value: d.dateOfBirth },
    { action: "fill", selector: "role=textbox[name='Enter E-mail ID']", value: d.email },

    // Address
    { action: "fill", selector: "#kyc_TempAddress1", value: d.address1 },
    { action: "fill", selector: "#kyc_TempAddress2", value: d.address2 },
    { action: "fill", selector: "#kyc_TempAddress3", value: d.address3 },
    { action: "fill", selector: "#kyc_LandMark", value: d.landmark },
    { action: "fill", selector: "#kyc_PinCode", value: d.pinCode },
    { action: "click", selector: "#select2-kyc_State-container" },
    { action: "fill", selector: "role=searchbox[name='Search']", value: d.state },
    { action: "press", selector: "role=searchbox[name='Search']", value: "Enter" },
    { action: "click", selector: "#select2-kyc_City-container" },
    { action: "click", selector: `role=option[name='${d.city}']` },
    { action: "check", selector: "#sameAsTempAddress" },
    // { action: "click", selector: "#select2-Comm_kycState-container" },
    // { action: "click", selector: "role=button[name='Next']" },
    { action: "check", selector: "#checkboxkyc2" },
    { action: "check", selector: "#sameProposerYes" },
    { action: "click", selector: "button.border-0.button-filled.ml-2.h-100 >> nth=1" },
    { action: "wait", value: "5000" },
    { action: "click", selector: "role=button[name='Thank you and Proceed']" },

    // Financial
    { action: "fill", selector: "role=textbox[name='Enter total monthly income']", value: d.monthlyIncome },
    { action: "fill", selector: "role=textbox[name='Enter total monthly expenses']", value: d.monthlyExpenses },
    { action: "click", selector: "#rptlifeStage_2" },
    { action: "click", selector: "#lb_lifeGoal_2" },
    { action: "click", selector: "#lb_risk_2" },
    { action: "click", selector: "#lb_time_2" },
    { action: "wait", value: "3000" },
    { action: "click", selector: "role=button[name='Next']" },

    // Product
    { action: "wait", value: "3000" },
    { action: "click", selector: "role=button[name='Buy Now'] >> nth=0" },
    { action: "fill", selector: "role=textbox[name='DD/MM/YYYY']", value: d.dateOfBirth },
    // { action: "wait", value: "30000" },
    { action: "click", selector: "role=button[name='Next']" },
    { action: "select", selector: "#dynInput_Mode", value: d.premiumMode },
    { action: "select", selector: "#ddlPT", value: d.policyTerm },
    { action: "select", selector: "#ddlPPT", value: d.premiumPayingTerm },
    { action: "select", selector: "#dynInput_Mode", value: d.premiumFrequency },
    { action: "select", selector: "#dynPR_CHANNEL", value: d.premiumChannel },
    { action: "select", selector: "#ddlOpt0", value: d.planOption},
    { action: "fill", selector: "role=textbox[name='Premium Amount']", value: d.premiumAmount },
    { action: "click", selector: "role=button[name='Calculate']" },
    { action: "click", selector: "role=button[name='Next']" },
    { action: "click", selector: "role=button[name='Submit & Continue']" },

    // Occupation / Proposer Details
    
    { action: "select", selector: "#Drd_Education", value: d.education },
    { action: "select", selector: "#Drd_Occupation", value: d.occupation },
    { action: "select", selector: "#Drd_ExactNatureOfDuty", value: d.natureOfDuty },
    { action: "fill", selector: "role=textbox[name='Please Enter Employer Name']", value: d.employerName },
    { action: "fill", selector: "role=textbox[name='Please Enter Address']", value: d.employerAddress },
    { action: "fill", selector: "role=textbox[name='Please Enter Designation']", value: d.designation },
    { action: "click", selector: "role=button[name='NEXT']" },
    // { action: "click", selector: "role=button[name='NEXT']" },
    // { action: "click", selector: "role=button[name='OK']" },

    // Family
    
    { action: "fill", selector: "#Txt_SpouseNAME", value: d.spouseName },
    { action: "fill", selector: "#Txt_FatherNAME", value: d.fatherName },
    { action: "fill", selector: "#TxtMotherName", value: d.motherName },

    // Nominee
    { action: "wait", value: "10000" },
    { action: "select", selector: "#Drd_NomineeRelation", value: d.nomineeRelation },
    { action: "select", selector: "#drd_NomineeTitle", value: d.nomineeTitle },
    { action: "fill", selector: "#Txt_NomineeName", value: d.nomineeName },
    { action: "wait", value: "20000" },
    { action: "fill", selector: "#Txt_SharePercentage", value: d.nomineeSharePercentage },
    { action: "fill", selector: "#Txt_NomineeDOB", value: d.nomineeDOB },
    { action: "wait", value: "30000" },
    { action: "click", selector: "role=button[name='Save Nominee']" },

    // FATCA
    { action: "click", selector: "#rad_USPerson > div > .text-center >> nth=0" },
    { action: "click", selector: "#Drd_ResidentOfIndia > div:nth-child(2) > .text-center" },

    // Bank Details
    { action: "fill", selector: "#Txt_PayerAccNumber", value: d.bankAccountNumber },
    { action: "fill", selector: "#Txt_PayerBankIFSCCode", value: d.ifscCode },
    { action: "wait", value: "15000" },
    { action: "click", selector: "#rad_BankConsent > div:nth-child(2) > .text-center" },

    // EIA
    { action: "click", selector: "#rad_OpenEIA > div > .text-center > .p-0 >> nth=0" },
    // { action: "click", selector: "role=button[name='NEXT']" },
    // { action: "click", selector: "role=button[name='OK']" },
    // { action: "click", selector: "#rad_OpenEIA > div > .text-center > .p-0 >> nth=0" },
    { action: "click", selector: "role=button[name='NEXT']" },

    // Health
    { action: "fill", selector: "#Txt_Weight", value: d.weightKgs },
    { action: "select", selector: "#Txt_Height_feetDrd", value: d.heightFeet },
    { action: "select", selector: "#Txt_Height_InchesDrd", value: d.heightInches },
    { action: "click", selector: "#rad_isTobaccoConsumed > div > .text-center > .p-0 >> nth=0" },
    { action: "click", selector: "#rad_isAlcoholConsumed > div > .text-center > .p-0 >> nth=0" },
    { action: "click", selector: "#rad_isNarcoticsConsumed > div > .text-center > .p-0 >> nth=0" },
    { action: "click", selector: "#rad_lifestyleQuest_1 > div > .text-center > .p-0 >> nth=0" },
    { action: "click", selector: "#rad_SMQ4 > div > .text-center > .p-0 >> nth=0" },
    { action: "click", selector: "#Drd_DiagnosedBefore60 > div > .text-center >> nth=0" },
    { action: "click", selector: "#rad_prevpolicyQue > div > .text-center >> nth=0" },
    { action: "click", selector: "#rad_PEP > div:nth-child(2) > .text-center" },
    { action: "click", selector: "#rad_SMQ3 > div:nth-child(2) > .text-center" },
    { action: "click", selector: "#rad_LMQ3 > div:nth-child(2) > .text-center > .p-0" },
    { action: "click", selector: "#rad_SMQ1 > div:nth-child(2) > .text-center > .p-0" },
    { action: "click", selector: "#rad_SMQ2 > div:nth-child(2) > .text-center > .p-0" },
    { action: "click", selector: "role=button[name='NEXT']" },

    // Final Submission
    { action: "check", selector: "#checkboxsummry1" },
    { action: "check", selector: "#checkboxsummry2" },
    { action: "check", selector: "#medicalradioN" },
    { action: "click", selector: "role=button[name='Submit']" },
    { action: "click", selector: ".slider" },
    { action: "click", selector: "role=button[name='Next']" },
    { action: "captureAppNumber" },

    // Document Upload
    { action: "click", selector: "role=textbox[name='Please Select Document']" },
    { action: "uploadFile", selector: "role=textbox[name='Please Select Document']", value: "Screenshot (1).png" },
    { action: "click", selector: "role=button[name='OK']" },
    { action: "check", selector: "role=checkbox[name='I agree, to receive any form ']" },
    { action: "click", selector: "role=button[name='Next']" },
    { action: "click", selector: "role=button[name='Confirm']" },
    { action: "click", selector: "role=button[name='Next']" },
    { action: "click", selector: "#digitaltoggle >> text=Yes" },
    { action: "click", selector: "role=button[name='PHYSICAL']" },
    { action: "click", selector: "#physicaltoggle >> text=Yes" },
    { action: "click", selector: "role=button[name='View and Download']" },
    { action: "click", selector: "role=button[name='Close']" },
    { action: "click", selector: "role=button[name='NEXT']" },

    // Payment
    { action: "goto", value: d.paymentUrl },
    { action: "click", selector: "role=button[name='Fund Transfer']" },
    { action: "fill", selector: "role=textbox[name='Enter Transfer Number']", value: d.fundTransferNumber },
    { action: "click", selector: "role=group[name='Fund Transfer'] >> role=button[name='Next']" },
    { action: "click", selector: "role=button[name='Next']" },

    // KYC Documents
    { action: "select", selector: "#drd_IdentityProof", value: "LUIDAI" },
    { action: "fill", selector: "role=textbox[name='Please Enter Last 4 Digits']", value: "1234" },
    { action: "click", selector: "#fileInput_104" },
    { action: "uploadFile", selector: "#fileInput_104", value: "Screenshot (1).png" },
    { action: "click", selector: "role=button[name='OK']" },
    { action: "select", selector: "#drd_AddressProof", value: "LUIDAI" },
    { action: "click", selector: "#fileInput_302" },
    { action: "uploadFile", selector: "#fileInput_302", value: "Screenshot (1).png" },
    { action: "click", selector: "role=button[name='OK']" },
    { action: "click", selector: "#fileInput_309" },
    { action: "uploadFile", selector: "#fileInput_309", value: "Screenshot (1).png" },
    { action: "click", selector: "role=button[name='OK']" },
    { action: "click", selector: "#fileInput_312" },
    { action: "uploadFile", selector: "#fileInput_312", value: "Screenshot (1).png" },
    { action: "click", selector: "role=button[name='OK']" },
    { action: "check", selector: "role=checkbox[name='I confirm that all the ']" },
    { action: "click", selector: "role=button[name='NEXT']" },
    { action: "check", selector: "#declare" },
    { action: "click", selector: "role=button[name='Submit']" },
    { action: "click", selector: "#ApplicationSuccessfull" },
  ];
}
