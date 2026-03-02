# TestDataTemplate.xlsx Structure

## Sheet: PramericaTestData

### Column Headers (Row 1):
| Column | Field Name | Data Type | Required | Validation | Example |
|--------|------------|-----------|----------|------------|---------|
| A | agentCode | Text | Yes | Exactly 8 digits | 70016333 |
| B | otp1 | Text | Yes | 1 digit | 1 |
| C | otp2 | Text | Yes | 1 digit | 2 |
| D | otp3 | Text | Yes | 1 digit | 3 |
| E | otp4 | Text | Yes | 1 digit | 1 |
| F | otp5 | Text | Yes | 1 digit | 2 |
| G | otp6 | Text | Yes | 1 digit | 3 |
| H | proposerPAN | Text | Yes | Format: AAAAA9999A (5 letters + 4 digits + 1 letter) | LLLLL9999H |
| I | mobileNumber | Text | Yes | Exactly 10 digits | 8888888888 |
| J | title | Text | Yes | MR/MRS/MS | MR |
| K | firstName | Text | Yes | 1-50 characters | Testing |
| L | middleName | Text | No | Max 50 characters | Testing |
| M | lastName | Text | Yes | 1-50 characters | Testing |
| N | dateOfBirth | Text | Yes | DD/MM/YYYY format | 22/10/1990 |
| O | email | Text | Yes | Valid email format | itarunbansal1@pramericalife.in |
| P | address1 | Text | Yes | 1-100 characters | gggui |
| Q | address2 | Text | No | Max 100 characters | gugiuhg |
| R | address3 | Text | No | Max 100 characters | huhujh |
| S | landmark | Text | No | Max 100 characters | gugiuhgju |
| T | pinCode | Text | Yes | Exactly 6 digits | 122018 |
| U | state | Text | Yes | 1-50 characters | Haryana |
| V | city | Text | Yes | 1-50 characters | Adampur 1- Haryana |
| W | monthlyIncome | Text | Yes | Number with optional commas | 1,00,0000 |
| X | monthlyExpenses | Text | Yes | Number with optional commas | 1,0000 |
| Y | maritalStatus | Text | Yes | single/married | married |
| Z | premiumMode | Text | Yes | Numeric value | 1 |
| AA | premiumChannel | Text | Yes | Numeric value | 19 |
| AB | premiumFrequency | Text | Yes | Numeric value | 3 |
| AC | premiumAmount | Text | Yes | Number with optional commas | 5,0000 |

### Sample Data (Row 2):
```
70016333,1,2,3,1,2,3,LLLLL9999H,8888888888,MR,Testing,Testing,Testing,22/10/1990,itarunbansal1@pramericalife.in,gggui,gugiuhg,huhujh,gugiuhgju,122018,Haryana,Adampur 1- Haryana,1,00,0000,1,0000,married,1,19,3,5,0000
```

## Instructions for Users:
1. Download the template from the frontend
2. Fill in test data starting from Row 2
3. Each row represents one test case
4. Upload the filled template to run automated tests
5. Ensure all validations are met before upload

## Detailed Validation Rules:

### Login Details
- **agentCode**: Must be exactly 8 digits (e.g., 70016333)
- **otp1-6**: Each must be exactly 1 digit (0-9)

### Proposer Details
- **proposerPAN**: Format AAAAA9999A (5 uppercase letters, 4 digits, 1 uppercase letter)
- **mobileNumber**: Must be exactly 10 digits

### Personal Information
- **title**: Must be one of: MR, MRS, MS
- **firstName**: Required, 1-50 characters
- **middleName**: Optional, max 50 characters
- **lastName**: Required, 1-50 characters
- **dateOfBirth**: Must be in DD/MM/YYYY format (e.g., 22/10/1990)
- **email**: Must be valid email format (e.g., user@domain.com)

### Address Details
- **address1**: Required, 1-100 characters
- **address2**: Optional, max 100 characters
- **address3**: Optional, max 100 characters
- **landmark**: Optional, max 100 characters
- **pinCode**: Must be exactly 6 digits
- **state**: Required, 1-50 characters
- **city**: Required, 1-50 characters

### Financial Details
- **monthlyIncome**: Required, numeric value (commas allowed, e.g., 1,00,0000)
- **monthlyExpenses**: Required, numeric value (commas allowed, e.g., 1,0000)
- **maritalStatus**: Must be either 'single' or 'married'

### Premium Details
- **premiumMode**: Required, numeric value (e.g., 1)
- **premiumChannel**: Required, numeric value (e.g., 19)
- **premiumFrequency**: Required, numeric value (e.g., 3)
- **premiumAmount**: Required, numeric value (commas allowed, e.g., 5,0000)

## Field Mapping to Playwright Script:

| Field | Playwright Selector | Action |
|-------|---------------------|--------|
| agentCode | role=textbox[name='Enter Code'] | fill |
| otp1-6 | #agentotp1 to #agentotp6 | fill |
| proposerPAN | role=textbox[name='Enter Proposer PAN'] | fill |
| mobileNumber | role=textbox[name='Enter your mobile number'] | fill |
| title | #kyc_Title | selectOption |
| firstName | role=textbox[name='Enter First Name'] | fill |
| middleName | role=textbox[name='Enter Middle Name'] | fill |
| lastName | role=textbox[name='Enter Last Name'] | fill |
| dateOfBirth | role=textbox[name='DD/MM/YYYY'] | fill |
| email | role=textbox[name='Enter E-mail ID'] | fill |
| address1 | #kyc_TempAddress1 | fill |
| address2 | #kyc_TempAddress2 | fill |
| address3 | #kyc_TempAddress3 | fill |
| landmark | #kyc_LandMark | fill |
| pinCode | #kyc_PinCode | fill |
| state | #select2-kyc_State-container | click + search |
| city | #select2-kyc_City-container | click + select |
| monthlyIncome | role=textbox[name='Enter total monthly income'] | fill |
| monthlyExpenses | role=textbox[name='Enter total monthly expenses'] | fill |
| maritalStatus | role=img[name='married' or 'single'] | click |
| premiumMode | #dynInput_Mode | selectOption |
| premiumChannel | #dynPR_CHANNEL | selectOption |
| premiumFrequency | #divoption0 >> role=combobox | selectOption |
| premiumAmount | role=textbox[name='Premium Amount'] | fill |
