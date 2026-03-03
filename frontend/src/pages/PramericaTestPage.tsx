import { FormEvent, useState } from "react";
import type { PramericaTestData } from "../types";

export default function PramericaTestPage() {
  const [agentCode, setAgentCode] = useState("70016333");
  const [otp, setOtp] = useState("123123");
  const [proposerPAN, setProposerPAN] = useState("LLLLL9999H");
  const [mobileNumber, setMobileNumber] = useState("8888888888");
  const [title, setTitle] = useState("MR");
  const [firstName, setFirstName] = useState("Testing");
  const [middleName, setMiddleName] = useState("Testing");
  const [lastName, setLastName] = useState("Testing");
  const [dateOfBirth, setDateOfBirth] = useState("22/10/1990");
  const [email, setEmail] = useState("itarunbansal1@pramericalife.in");
  const [address1, setAddress1] = useState("gggui");
  const [address2, setAddress2] = useState("gugiuhg");
  const [address3, setAddress3] = useState("huhujh");
  const [landmark, setLandmark] = useState("gugiuhgju");
  const [pinCode, setPinCode] = useState("122018");
  const [state, setState] = useState("Haryana");
  const [city, setCity] = useState("Adampur 1- Haryana");
  const [monthlyIncome, setMonthlyIncome] = useState("1,00,0000");
  const [monthlyExpenses, setMonthlyExpenses] = useState("1,0000");
  const [maritalStatus, setMaritalStatus] = useState("married");
  const [premiumMode, setPremiumMode] = useState("1");
  const [premiumChannel, setPremiumChannel] = useState("19");
  const [premiumFrequency, setPremiumFrequency] = useState("3");
  const [planOption, setPlanOption] = useState("3");
  const [premiumAmount, setPremiumAmount] = useState("5,0000");

  const [jsonOutput, setJsonOutput] = useState("");

  const validateAgentCode = (code: string) => /^\d{8}$/.test(code);
  const validateOTP = (o: string) => /^\d{6}$/.test(o);
  const validatePAN = (pan: string) => /^[A-Z]{5}\d{4}[A-Z]$/i.test(pan);
  const validateMobile = (mobile: string) => /^\d{10}$/.test(mobile);
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePinCode = (pin: string) => /^\d{6}$/.test(pin);
  const validateDate = (date: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(date);

  function generateJSON() {
    const testData: PramericaTestData = {
      agentCode,
      otp1: otp[0] ?? "", otp2: otp[1] ?? "", otp3: otp[2] ?? "", otp4: otp[3] ?? "", otp5: otp[4] ?? "", otp6: otp[5] ?? "",
      sameProposer: "Yes",
      proposerPAN,
      mobileNumber,
      title,
      firstName,
      middleName,
      lastName,
      gender: title === "MR" ? "Male" : "Female",
      dateOfBirth,
      email,
      address1,
      address2,
      address3,
      landmark,
      pinCode,
      state,
      city,
      monthlyIncome,
      monthlyExpenses,
      maritalStatus,
      premiumMode,
      premiumChannel,
      premiumFrequency,
      planOption,
      premiumAmount,
      policyTerm: "",
      premiumPayingTerm: "",
      education: "",
      occupation: "",
      natureOfDuty: "",
      employerName: "",
      employerAddress: "",
      designation: "",
      annualIncome: "",
      spouseName: "",
      fatherName: "",
      motherName: "",
      nomineeRelation: "",
      nomineeTitle: "",
      nomineeName: "",
      nomineeGender: "",
      nomineeSharePercentage: "",
      nomineeDOB: "",
      bankAccountNumber: "",
      ifscCode: "",
      weightKgs: "",
      heightFeet: "",
      heightInches: "",
    };

    const playwrightJSON = {
      url: "https://nvestuat.pramericalife.in/Life/Login.html",
      steps: [
        { action: "goto", value: "https://nvestuat.pramericalife.in/Life/Login.html" },
        { action: "fill", selector: "role=textbox[name='Enter Code']", value: agentCode },
        ...otp.split("").map((d, i) => ({ action: "fill", selector: `#agentotp${i + 1}`, value: d })),
        { action: "click", selector: "role=button[name='Sign In']" },
        { action: "click", selector: "role=button[name='Yes, Force Login']" },
        { action: "fill", selector: "role=textbox[name='Enter Proposer PAN']", value: proposerPAN },
        { action: "fill", selector: "role=textbox[name='Enter your mobile number']", value: mobileNumber },
        { action: "check", selector: "#kycckecked" },
        { action: "click", selector: "role=button[name='Submit']" },
        { action: "click", selector: "text=Proceed without e-KYC" },
        { action: "select", selector: "#kyc_Title", value: title },
        { action: "fill", selector: "role=textbox[name='Enter First Name']", value: firstName },
        { action: "fill", selector: "role=textbox[name='Enter Middle Name']", value: middleName },
        { action: "fill", selector: "role=textbox[name='Enter Last Name']", value: lastName },
        { action: "fill", selector: "role=textbox[name='DD/MM/YYYY']", value: dateOfBirth },
        { action: "fill", selector: "role=textbox[name='Enter E-mail ID']", value: email },
        { action: "fill", selector: "#kyc_TempAddress1", value: address1 },
        { action: "fill", selector: "#kyc_TempAddress2", value: address2 },
        { action: "fill", selector: "#kyc_TempAddress3", value: address3 },
        { action: "fill", selector: "#kyc_LandMark", value: landmark },
        { action: "fill", selector: "#kyc_PinCode", value: pinCode },
        { action: "click", selector: "#select2-kyc_State-container" },
        { action: "fill", selector: "role=searchbox[name='Search']", value: state },
        { action: "press", selector: "role=searchbox[name='Search']", value: "Enter" },
        { action: "click", selector: "#select2-kyc_City-container" },
        { action: "click", selector: `role=option[name='${city}']` },
        { action: "check", selector: "#sameAsTempAddress" },
        { action: "check", selector: "role=checkbox[name='I authorize Pramerica Life']" },
        { action: "click", selector: "role=button[name='Next']" },
        { action: "click", selector: "text=Copy" },
        { action: "click", selector: "role=button[name='Thank you and Proceed']" },
        { action: "fill", selector: "role=textbox[name='Enter total monthly income']", value: monthlyIncome },
        { action: "fill", selector: "role=textbox[name='Enter total monthly expenses']", value: monthlyExpenses },
        { action: "click", selector: `role=img[name='${maritalStatus}']` },
        { action: "click", selector: "#lb_lifeGoal_2" },
        { action: "click", selector: "#lb_risk_2" },
        { action: "click", selector: "#lb_time_2" },
        { action: "click", selector: "role=button[name='Next']" },
        { action: "click", selector: "role=button[name='Buy Now'] >> nth=0" },
        { action: "click", selector: "role=button[name='Next']" },
        { action: "select", selector: "#dynInput_Mode", value: premiumMode },
        { action: "select", selector: "#dynPR_CHANNEL", value: premiumChannel },
        { action: "select", selector: "#divoption0 >> role=combobox", value: premiumFrequency },
        { action: "select", selector: "#ddlOpt0 >> role=combobox", value: planOption },
        { action: "fill", selector: "role=textbox[name='Premium Amount']", value: premiumAmount },
        { action: "click", selector: "role=button[name='Calculate']" }
      ],
      testData
    };

    setJsonOutput(JSON.stringify(playwrightJSON, null, 2));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    generateJSON();
  }

  return (
    <section className="panel">
      <h2>Pramerica Test Data Builder</h2>
      <form onSubmit={onSubmit} className="builder-form">
        <h3>Login Details</h3>
        <div className="grid">
          <label>
            Agent Code {!validateAgentCode(agentCode) && <span style={{color: "red"}}>*8 digits</span>}
            <input value={agentCode} onChange={(e) => setAgentCode(e.target.value)} maxLength={8} />
          </label>
        </div>
        
        <div className="grid">
          <label>
            OTP {!validateOTP(otp) && <span style={{color: "red"}}>*6 digits</span>}
            <input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
          </label>
        </div>

        <h3>Proposer Details</h3>
        <div className="grid">
          <label>
            PAN {!validatePAN(proposerPAN) && <span style={{color: "red"}}>*Invalid</span>}
            <input value={proposerPAN} onChange={(e) => setProposerPAN(e.target.value.toUpperCase())} maxLength={10} />
          </label>
          <label>
            Mobile {!validateMobile(mobileNumber) && <span style={{color: "red"}}>*10 digits</span>}
            <input value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} maxLength={10} />
          </label>
        </div>

        <h3>Personal Information</h3>
        <div className="grid">
          <label>Title <select value={title} onChange={(e) => setTitle(e.target.value)}>
            <option value="MR">MR</option>
            <option value="MRS">MRS</option>
            <option value="MS">MS</option>
          </select></label>
          <label>First Name <input value={firstName} onChange={(e) => setFirstName(e.target.value)} /></label>
          <label>Middle Name <input value={middleName} onChange={(e) => setMiddleName(e.target.value)} /></label>
          <label>Last Name <input value={lastName} onChange={(e) => setLastName(e.target.value)} /></label>
        </div>

        <div className="grid">
          <label>
            DOB (DD/MM/YYYY) {!validateDate(dateOfBirth) && <span style={{color: "red"}}>*Invalid</span>}
            <input value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} placeholder="DD/MM/YYYY" />
          </label>
          <label>
            Email {!validateEmail(email) && <span style={{color: "red"}}>*Invalid</span>}
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
        </div>

        <h3>Address</h3>
        <div className="grid">
          <label>Address Line 1 <input value={address1} onChange={(e) => setAddress1(e.target.value)} /></label>
          <label>Address Line 2 <input value={address2} onChange={(e) => setAddress2(e.target.value)} /></label>
          <label>Address Line 3 <input value={address3} onChange={(e) => setAddress3(e.target.value)} /></label>
          <label>Landmark <input value={landmark} onChange={(e) => setLandmark(e.target.value)} /></label>
        </div>

        <div className="grid">
          <label>
            Pin Code {!validatePinCode(pinCode) && <span style={{color: "red"}}>*6 digits</span>}
            <input value={pinCode} onChange={(e) => setPinCode(e.target.value)} maxLength={6} />
          </label>
          <label>State <input value={state} onChange={(e) => setState(e.target.value)} /></label>
          <label>City <input value={city} onChange={(e) => setCity(e.target.value)} /></label>
        </div>

        <h3>Financial Details</h3>
        <div className="grid">
          <label>Monthly Income <input value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} /></label>
          <label>Monthly Expenses <input value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(e.target.value)} /></label>
          <label>Marital Status <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
            <option value="single">Single</option>
            <option value="married">Married</option>
          </select></label>
        </div>

        <h3>Premium Details</h3>
        <div className="grid">
          <label>Premium Mode <input value={premiumMode} onChange={(e) => setPremiumMode(e.target.value)} /></label>
          <label>Premium Channel <input value={premiumChannel} onChange={(e) => setPremiumChannel(e.target.value)} /></label>
          <label>Premium Frequency <input value={premiumFrequency} onChange={(e) => setPremiumFrequency(e.target.value)} /></label>
          <label>Premium Amount <input value={premiumAmount} onChange={(e) => setPremiumAmount(e.target.value)} /></label>
        </div>

        <button type="submit">Generate JSON</button>
      </form>

      {jsonOutput && (
        <div style={{marginTop: "20px"}}>
          <h3>Generated JSON</h3>
          <textarea rows={20} value={jsonOutput} readOnly style={{width: "100%", fontFamily: "monospace"}} />
        </div>
      )}
    </section>
  );
}
