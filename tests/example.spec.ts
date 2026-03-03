import { test } from '@playwright/test';

test('Pramerica Life Insurance - Full Policy Creation Flow', async ({ page }) => {
  await page.goto('https://nvestuat.pramericalife.in/Life/Login.html');

  // Login
  await page.getByRole('textbox', { name: 'Enter Code' }).fill('70016333');
  await page.getByRole('textbox', { name: 'Enter Code' }).press('Tab');
  await page.locator('#agentotp1').fill('1');
  await page.locator('#agentotp2').fill('2');
  await page.locator('#agentotp3').fill('3');
  await page.locator('#agentotp4').fill('1');
  await page.locator('#agentotp5').fill('2');
  await page.locator('#agentotp6').fill('3');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('button', { name: 'Yes, Force Login' }).click();

  // Start Application
  await page.locator('div').filter({ hasText: 'Loading...' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Enter Proposer PAN' }).fill('DOHPD3761M');
  await page.getByRole('textbox', { name: 'Enter your mobile number' }).fill('8700029028');
  await page.locator('#kycckecked').check();
  await page.getByRole('button', { name: 'Submit' }).click();

  // KYC Details
  await page.getByRole('heading', { name: 'Proceed without e-KYC' }).click();
  //await page.locator('#sameProposerYes').click('Yes');
  await page.locator('label').filter({ hasText: 'Yes' }).click();
  await page.locator('#kyc_Title').selectOption('MR');
  await page.getByRole('textbox', { name: 'Enter First Name' }).fill('Navroz');
  await page.getByRole('textbox', { name: 'Enter Last Name' }).fill('Dewan');
  await page.getByRole('textbox', { name: 'Enter Last Name' }).press('Tab');
  await page.getByRole('textbox', { name: 'DD/MM/YYYY' }).fill('10/10/1998');

  // Contact Details
  await page.getByText('Contact Details').click();
  await page.getByRole('textbox', { name: 'Enter E-mail ID' }).fill('navroz.dewan@pramericalife.in');

  // Address
  await page.locator('#kyc_TempAddress1').fill('iowjwoihe');
  await page.locator('#kyc_TempAddress1').press('Tab');
  await page.locator('#kyc_TempAddress2').fill('iohoiho');
  await page.locator('#kyc_TempAddress2').press('Tab');
  await page.locator('#kyc_TempAddress3').fill('iohoih');
  await page.locator('#kyc_TempAddress3').press('Tab');
  await page.locator('#kyc_LandMark').fill('oihoih');
  await page.locator('#kyc_LandMark').press('Tab');
  await page.locator('#kyc_PinCode').fill('201301');
  await page.locator('#kyc_PinCode').press('Tab');
  await page.locator('#select2-kyc_State-container').click();
  await page.getByRole('option', { name: 'Andaman and Nicobar Islands' }).click();
  await page.locator('#select2-kyc_City-container').click();
  await page.getByRole('option', { name: 'Abhaipur' }).click();
  await page.locator('#sameAsTempAddress').check();

  // Communication address same as temp
  await page.locator('#select2-Comm_kycState-container').click();
  await page.getByRole('checkbox', { name: 'I authorize Pramerica Life ' }).press('Home');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Thank you and Proceed' }).click();

  // Financial Details
  await page.locator('div').filter({ hasText: 'Loading...' }).nth(5).click();
  await page.getByRole('textbox', { name: 'Enter total monthly income' }).fill('9,0000');
  await page.getByRole('textbox', { name: 'Enter total monthly expenses' }).fill('1000');
  await page.locator('#rptlifeStage_2').click();
  await page.locator('#lb_lifeGoal_2').click();
  await page.locator('#lb_risk_2').click();
  await page.locator('#lb_time_2').click();
  await page.getByRole('button', { name: 'Next' }).click();

  // Product Selection
  await page.getByRole('button', { name: 'Buy Now' }).first().click();
  await page.locator('.input-group').first().click();
  await page.locator('#LA_gender').getByText('Male', { exact: true }).click();
  await page.locator('#dynInput_Mode').selectOption('1');
  await page.locator('#ddlPT').selectOption('20');
  await page.locator('#ddlPPT').selectOption('9');
  await page.locator('#dynInput_Mode').selectOption('1');
  await page.locator('#dynPR_CHANNEL').selectOption('19');
  await page.locator('#ddlOpt0').getByRole('combobox').selectOption('3');
  await page.getByRole('textbox', { name: 'Premium Amount' }).fill('2,30,00');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Submit & Continue' }).click();

  // Proposer / Life Assured Details
  await page.locator('.noPadding.Placeholder100').first().click();
  await page.locator('label').filter({ hasText: /^MALE$/ }).click();
  await page.locator('#Drd_Education').selectOption('PGA');
  await page.locator('#Drd_Occupation').selectOption('SL');
  await page.locator('#Drd_ExactNatureOfDuty').selectOption('MGCN');
  await page.getByRole('textbox', { name: 'Please Enter Employer Name' }).fill('PliL');
  await page.getByRole('textbox', { name: 'Please Enter Employer Name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Please Enter Address' }).fill('Nfjnfk');
  await page.getByRole('textbox', { name: 'Please Enter Address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Please Enter Designation' }).fill('Jnwjnjwekn');

  // PAN / CKYC
  await page.locator('#controldivDrd_PremPayerPANForm60 > .noPadding.Placeholder100').click();
  await page.getByLabel('Additional Details Premium Payer\'s PAN/Form 60* SelectForm 60PAN Please select Premium Payer\'s PAN/Form 60 PAN CARD* PAN verified successfullyThis field is required Please Enter First and Lastname Do you have an existing CKYC?* NoYes Please Select Yes or No CKYC Number* Enter CKYC Number Please Enter First and Lastname Account Type* SelectNormalSimplifiedSmall Please Select Account Type Enter your ABHA number Please Enter ABHA number Please Enter First and Lastname Edit', { exact: true }).getByText('No', { exact: true }).click();
  await page.getByRole('button', { name: 'NEXT' }).click();
  await page.getByRole('button', { name: 'NEXT' }).click();
  await page.getByRole('button', { name: 'OK' }).click();

  // Family Details
  await page.locator('#Txt_SpouseNAME').fill('Fnkkjrnkr fknk');
  await page.locator('#Txt_SpouseNAME').press('Tab');
  await page.locator('#Txt_FatherNAME').fill('Kefnkfe knekj');
  await page.locator('#TxtMotherName').fill('Eknek nefk');

  // Nominee Details
  await page.locator('#Drd_NomineeRelation').selectOption('FTR');
  await page.locator('#drd_NomineeTitle').selectOption('DR');
  await page.locator('#drd_NomineeTitle').press('Tab');
  await page.getByRole('textbox', { name: 'Please Enter First and Last ' }).fill('Dkfknfjkn dkjndk');
  await page.getByRole('textbox', { name: 'Please Enter First and Last ' }).press('Tab');
  await page.getByRole('textbox', { name: 'Please Enter Nominee Share ' }).fill('100');
  await page.getByRole('textbox', { name: 'DD/MM/YYYY' }).fill('10/10/1956');
  await page.getByRole('button', { name: 'Save Nominee' }).click();

  // FATCA / Residency
  await page.locator('#rad_USPerson > div > .text-center').first().click();
  await page.locator('#Drd_ResidentOfIndia > div:nth-child(2) > .text-center').click();

  // Bank Details
  await page.getByRole('textbox', { name: 'Please Enter Account number' }).fill('9812977128928');
  await page.getByRole('textbox', { name: 'Please Enter Account number' }).press('Tab');
  await page.getByRole('textbox', { name: 'Please Enter IFSC code' }).fill('ICIC0000035');
  await page.getByRole('textbox', { name: 'Please Enter IFSC code' }).press('Tab');
  await page.locator('#rad_BankConsent > div:nth-child(2) > .text-center').click();

  // EIA
  await page.locator('#rad_OpenEIA > div > .text-center > .p-0').first().click();
  await page.getByRole('button', { name: 'NEXT' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.locator('#rad_OpenEIA > div > .text-center > .p-0').first().click();
  await page.getByRole('button', { name: 'NEXT' }).click();

  // Medical / Health Questions
  await page.getByRole('textbox', { name: 'Please Enter Weight (kgs)' }).fill('120');
  await page.locator('#Txt_Height_feetDrd').selectOption('5');
  await page.locator('#Txt_Height_InchesDrd').selectOption('11');
  await page.locator('#rad_isTobaccoConsumed > div > .text-center > .p-0').first().click();
  await page.locator('#rad_isAlcoholConsumed > div > .text-center > .p-0').first().click();
  await page.locator('#rad_isNarcoticsConsumed > div > .text-center > .p-0').first().click();
  await page.locator('#rad_lifestyleQuest_1 > div > .text-center > .p-0').first().click();
  await page.locator('#rad_SMQ4 > div > .text-center > .p-0').first().click();
  await page.locator('#Drd_DiagnosedBefore60 > div > .text-center').first().click();
  await page.locator('#rad_prevpolicyQue > div > .text-center').first().click();
  await page.locator('#rad_PEP > div:nth-child(2) > .text-center').click();
  await page.locator('#rad_SMQ3 > div:nth-child(2) > .text-center').click();
  await page.locator('#rad_LMQ3 > div:nth-child(2) > .text-center > .p-0').click();
  await page.locator('#rad_SMQ1 > div:nth-child(2) > .text-center > .p-0').click();
  await page.locator('#rad_SMQ2 > div:nth-child(2) > .text-center > .p-0').click();
  await page.getByRole('button', { name: 'NEXT' }).click();

  // Final Submission
  await page.getByRole('checkbox', { name: 'I have reviewed the policy ' }).check();
  await page.getByRole('checkbox', { name: 'I agree, confirm and enroll ' }).check();
  await page.locator('.d-flex.mb-0 > label:nth-child(2)').first().click();
  await page.locator('#medicalradioN').check();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.locator('.slider').click();
  await page.getByRole('button', { name: 'Next' }).click();
});
