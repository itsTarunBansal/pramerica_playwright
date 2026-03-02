# Playwright Script to JSON Conversion Schema

## Overview
This document describes the JSON structure generated from the Playwright script for Pramerica Life Insurance test automation.

## JSON Structure

```json
{
  "url": "string",
  "steps": [
    {
      "action": "goto | fill | click | check | select | press",
      "selector": "string (optional for goto)",
      "value": "string (optional)"
    }
  ],
  "testData": {
    "agentCode": "string",
    "otp1": "string",
    "otp2": "string",
    "otp3": "string",
    "otp4": "string",
    "otp5": "string",
    "otp6": "string",
    "proposerPAN": "string",
    "mobileNumber": "string",
    "title": "string",
    "firstName": "string",
    "middleName": "string",
    "lastName": "string",
    "dateOfBirth": "string",
    "email": "string",
    "address1": "string",
    "address2": "string",
    "address3": "string",
    "landmark": "string",
    "pinCode": "string",
    "state": "string",
    "city": "string",
    "monthlyIncome": "string",
    "monthlyExpenses": "string",
    "maritalStatus": "string",
    "premiumMode": "string",
    "premiumChannel": "string",
    "premiumFrequency": "string",
    "premiumAmount": "string"
  }
}
```

## Complete Example

```json
{
  "url": "https://nvestuat.pramericalife.in/Life/Login.html",
  "steps": [
    {
      "action": "goto",
      "value": "https://nvestuat.pramericalife.in/Life/Login.html"
    },
    {
      "action": "fill",
      "selector": "role=textbox[name='Enter Code']",
      "value": "70016333"
    },
    {
      "action": "fill",
      "selector": "#agentotp1",
      "value": "1"
    },
    {
      "action": "fill",
      "selector": "#agentotp2",
      "value": "2"
    },
    {
      "action": "fill",
      "selector": "#agentotp3",
      "value": "3"
    },
    {
      "action": "fill",
      "selector": "#agentotp4",
      "value": "1"
    },
    {
      "action": "fill",
      "selector": "#agentotp5",
      "value": "2"
    },
    {
      "action": "fill",
      "selector": "#agentotp6",
      "value": "3"
    },
    {
      "action": "click",
      "selector": "role=button[name='Sign In']"
    },
    {
      "action": "click",
      "selector": "role=button[name='Yes, Force Login']"
    },
    {
      "action": "fill",
      "selector": "role=textbox[name='Enter Proposer PAN']",
      "value": "LLLLL9999H"
    },
    {
      "action": "fill",
      "selector": "role=textbox[name='Enter your mobile number']",
      "value": "8888888888"
    },
    {
      "action": "check",
      "selector": "#kycckecked"
    },
    {
      "action": "click",
      "selector": "role=button[name='Submit']"
    },
    {
      "action": "click",
      "selector": "text=Proceed without e-KYC"
    },
    {
      "action": "select",
      "selector": "#kyc_Title",
      "value": "MR"
    },
    {
      "action": "fill",
      "selector": "role=textbox[name='Enter First Name']",
      "value": "Testing"
    },
    {
      "action": "fill",
      "selector": "role=textbox[name='Enter Middle Name']",
      "value": "Testing"
    },
    {
      "action": "fill",
      "selector": "role=textbox[name='Enter Last Name']",
      "value": "Testing"
    },
    {
      "action": "fill",
      "selector": "role=textbox[name='DD/MM/YYYY']",
      "value": "22/10/1990"
    },
    {
      "action": "fill",
      "selector": "role=textbox[name='Enter E-mail ID']",
      "value": "itarunbansal1@pramericalife.in"
    },
    {
      "action": "fill",
      "selector": "#kyc_TempAddress1",
      "value": "gggui"
    },
    {
      "action": "fill",
      "selector": "#kyc_TempAddress2",
      "value": "gugiuhg"
    },
    {
      "action": "fill",
      "selector": "#kyc_TempAddress3",
      "value": "huhujh"
    },
    {
      "action": "fill",
      "selector": "#kyc_LandMark",
      "value": "gugiuhgju"
    },
    {
      "action": "fill",
      "selector": "#kyc_PinCode",
      "value": "122018"
    },
    {
      "action": "click",
      "selector": "#select2-kyc_State-container"
    },
    {
      "action": "fill",
      "selector": "role=searchbox[name='Search']",
      "value": "Haryana"
    },
    {
      "action": "press",
      "selector": "role=searchbox[name='Search']",
      "value": "Enter"
    },
    {
      "action": "click",
      "selector": "#select2-kyc_City-container"
    },
    {
      "action": "click",
      "selector": "role=option[name='Adampur 1- Haryana']"
    },
    {
      "action": "check",
      "selector": "#sameAsTempAddress"
    },
    {
      "action": "check",
      "selector": "role=checkbox[name='I authorize Pramerica Life']"
    },
    {
      "action": "click",
      "selector": "role=button[name='Next']"
    },
    {
      "action": "click",
      "selector": "text=Copy"
    },
    {
      "action": "click",
      "selector": "role=button[name='Thank you and Proceed']"
    },
    {
      "action": "fill",
      "selector": "role=textbox[name='Enter total monthly income']",
      "value": "1,00,0000"
    },
    {
      "action": "fill",
      "selector": "role=textbox[name='Enter total monthly expenses']",
      "value": "1,0000"
    },
    {
      "action": "click",
      "selector": "role=img[name='married']"
    },
    {
      "action": "click",
      "selector": "#lb_lifeGoal_2"
    },
    {
      "action": "click",
      "selector": "#lb_risk_2"
    },
    {
      "action": "click",
      "selector": "#lb_time_2"
    },
    {
      "action": "click",
      "selector": "role=button[name='Next']"
    },
    {
      "action": "click",
      "selector": "role=button[name='Buy Now'] >> nth=0"
    },
    {
      "action": "click",
      "selector": "role=button[name='Next']"
    },
    {
      "action": "select",
      "selector": "#dynInput_Mode",
      "value": "1"
    },
    {
      "action": "select",
      "selector": "#dynPR_CHANNEL",
      "value": "19"
    },
    {
      "action": "select",
      "selector": "#divoption0 >> role=combobox",
      "value": "3"
    },
    {
      "action": "fill",
      "selector": "role=textbox[name='Premium Amount']",
      "value": "5,0000"
    },
    {
      "action": "click",
      "selector": "role=button[name='Calculate']"
    }
  ],
  "testData": {
    "agentCode": "70016333",
    "otp1": "1",
    "otp2": "2",
    "otp3": "3",
    "otp4": "1",
    "otp5": "2",
    "otp6": "3",
    "proposerPAN": "LLLLL9999H",
    "mobileNumber": "8888888888",
    "title": "MR",
    "firstName": "Testing",
    "middleName": "Testing",
    "lastName": "Testing",
    "dateOfBirth": "22/10/1990",
    "email": "itarunbansal1@pramericalife.in",
    "address1": "gggui",
    "address2": "gugiuhg",
    "address3": "huhujh",
    "landmark": "gugiuhgju",
    "pinCode": "122018",
    "state": "Haryana",
    "city": "Adampur 1- Haryana",
    "monthlyIncome": "1,00,0000",
    "monthlyExpenses": "1,0000",
    "maritalStatus": "married",
    "premiumMode": "1",
    "premiumChannel": "19",
    "premiumFrequency": "3",
    "premiumAmount": "5,0000"
  }
}
```

## Action Types

| Action | Description | Requires Selector | Requires Value |
|--------|-------------|-------------------|----------------|
| goto | Navigate to URL | No | Yes (URL) |
| fill | Fill input field | Yes | Yes (text) |
| click | Click element | Yes | No |
| check | Check checkbox | Yes | No |
| select | Select dropdown option | Yes | Yes (option value) |
| press | Press keyboard key | Yes | Yes (key name) |

## Selector Types

| Type | Example | Description |
|------|---------|-------------|
| Role-based | `role=textbox[name='Enter Code']` | Playwright role selector |
| ID | `#agentotp1` | Element ID |
| Text | `text=Proceed without e-KYC` | Text content |
| Combined | `#divoption0 >> role=combobox` | Chained selectors |
| Nth | `role=button[name='Buy Now'] >> nth=0` | First matching element |

## Usage in Frontend

The JSON is generated by the `PramericaTestPage.tsx` component when the user fills the form and clicks "Generate JSON". The generated JSON can be:

1. Copied and used directly in test automation
2. Saved to a file for later use
3. Sent to the backend API for test case creation
4. Used with the TestDataTemplate.xlsx for bulk test generation

## Integration with TestDataTemplate.xlsx

Each row in the Excel template maps to the `testData` object in the JSON. The frontend can:

1. Parse the Excel file
2. Generate one JSON object per row
3. Create multiple test cases in bulk
4. Execute tests with different data sets
