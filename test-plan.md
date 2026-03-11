# Pramerica Life Insurance Agent Portal Test Plan

## Application Overview

This test plan covers the login process for agents and the initiation of a new application in the Pramerica Life Insurance portal. It includes happy path scenarios, edge cases, and error handling for a comprehensive testing approach.

## Test Scenarios

### 1. Agent Login Suite

**Seed:** `tests/seed.spec.ts`

#### 1.1. Successful Agent Login with Valid Credentials

**File:** `tests/login.spec.ts`

**Steps:**
  1. Navigate to https://nvestuat.pramericalife.in/Life/Login.html
    - expect: Login page loads with Agent tab selected
    - expect: Agent ID and PIN fields are visible
  2. Enter Agent ID: 70016333
    - expect: Agent ID field accepts input
  3. Enter PIN digits: 1,2,3,1,2,3 in respective fields
    - expect: PIN fields accept individual digits
  4. Click Sign In button
    - expect: Active session dialog appears if session exists
  5. Click Yes, Force Login if dialog appears
    - expect: Force login dialog handled
  6. Verify home page loads
    - expect: Redirected to home page with Start New Application option

#### 1.2. Login with Invalid Agent ID

**File:** `tests/login.spec.ts`

**Steps:**
  1. Navigate to login page
    - expect: Login page loads
  2. Enter invalid Agent ID and valid PIN, click Sign In
    - expect: Error message displayed
  3. Verify no redirection
    - expect: User remains on login page

#### 1.3. Login with Invalid PIN

**File:** `tests/login.spec.ts`

**Steps:**
  1. Enter valid Agent ID and invalid PIN, click Sign In
    - expect: Error message for invalid PIN

#### 1.4. Login with Empty Fields

**File:** `tests/login.spec.ts`

**Steps:**
  1. Click Sign In without entering credentials
    - expect: Validation errors for empty fields

#### 1.5. Employee Tab Login Attempt

**File:** `tests/login.spec.ts`

**Steps:**
  1. Switch to Employee tab
    - expect: Employee login fields appear
  2. Attempt login with agent credentials
    - expect: Agent credentials do not work

#### 1.6. Forgot PIN Functionality

**File:** `tests/login.spec.ts`

**Steps:**
  1. Click Forgot Pin link
    - expect: Forgot PIN page or dialog opens

#### 1.7. Sign Up Functionality

**File:** `tests/login.spec.ts`

**Steps:**
  1. Click Sign Up link
    - expect: Sign up page opens

### 2. Start New Application Suite

**Seed:** `tests/seed.spec.ts`

#### 2.1. Initiate New Application with Valid Details

**File:** `tests/new-application.spec.ts`

**Steps:**
  1. Perform successful login
    - expect: Logged in to home page
  2. Click Start New Application
    - expect: Start New Application dialog opens
  3. Verify dialog contents
    - expect: PAN and Mobile fields visible
  4. Enter valid PAN (e.g., ABCDE1234F)
    - expect: Valid PAN accepted
  5. Enter valid mobile number (e.g., 9876543210)
    - expect: Valid mobile number accepted
  6. Check the authorization checkbox
    - expect: Checkbox checked
  7. Click Submit button
    - expect: Application proceeds to next step

#### 2.2. Start New Application with Invalid PAN

**File:** `tests/new-application.spec.ts`

**Steps:**
  1. Enter invalid PAN format and submit
    - expect: Validation error for invalid PAN

#### 2.3. Start New Application with Invalid Mobile

**File:** `tests/new-application.spec.ts`

**Steps:**
  1. Enter invalid mobile number and submit
    - expect: Validation error for invalid mobile

#### 2.4. Start New Application without Checkbox

**File:** `tests/new-application.spec.ts`

**Steps:**
  1. Fill PAN and mobile but leave checkbox unchecked, submit
    - expect: Submit disabled or error

#### 2.5. Close New Application Dialog

**File:** `tests/new-application.spec.ts`

**Steps:**
  1. Click Close button in dialog
    - expect: Dialog closes

#### 2.6. Start New Application without Login

**File:** `tests/new-application.spec.ts`

**Steps:**
  1. Attempt to access new application URL without login
    - expect: Redirect to login or access denied
