export interface FieldValidation {
  name: string;
  type: 'text' | 'number' | 'email' | 'select' | 'date';
  required: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  errorMessage?: string;
  options?: string[];
}

export const pramericaFieldValidations: Record<string, FieldValidation> = {
  agentCode: {
    name: 'Agent Code',
    type: 'text',
    required: true,
    pattern: /^\d{8}$/,
    minLength: 8,
    maxLength: 8,
    errorMessage: 'Must be exactly 8 digits'
  },
  otp1: {
    name: 'OTP 1',
    type: 'text',
    required: true,
    pattern: /^\d{1}$/,
    maxLength: 1,
    errorMessage: 'Must be 1 digit'
  },
  otp2: {
    name: 'OTP 2',
    type: 'text',
    required: true,
    pattern: /^\d{1}$/,
    maxLength: 1,
    errorMessage: 'Must be 1 digit'
  },
  otp3: {
    name: 'OTP 3',
    type: 'text',
    required: true,
    pattern: /^\d{1}$/,
    maxLength: 1,
    errorMessage: 'Must be 1 digit'
  },
  otp4: {
    name: 'OTP 4',
    type: 'text',
    required: true,
    pattern: /^\d{1}$/,
    maxLength: 1,
    errorMessage: 'Must be 1 digit'
  },
  otp5: {
    name: 'OTP 5',
    type: 'text',
    required: true,
    pattern: /^\d{1}$/,
    maxLength: 1,
    errorMessage: 'Must be 1 digit'
  },
  otp6: {
    name: 'OTP 6',
    type: 'text',
    required: true,
    pattern: /^\d{1}$/,
    maxLength: 1,
    errorMessage: 'Must be 1 digit'
  },
  proposerPAN: {
    name: 'Proposer PAN',
    type: 'text',
    required: true,
    pattern: /^[A-Z]{5}\d{4}[A-Z]$/i,
    minLength: 10,
    maxLength: 10,
    errorMessage: 'Format: AAAAA9999A (5 letters, 4 digits, 1 letter)'
  },
  mobileNumber: {
    name: 'Mobile Number',
    type: 'text',
    required: true,
    pattern: /^\d{10}$/,
    minLength: 10,
    maxLength: 10,
    errorMessage: 'Must be exactly 10 digits'
  },
  title: {
    name: 'Title',
    type: 'select',
    required: true,
    options: ['MR', 'MRS', 'MS'],
    errorMessage: 'Please select a title'
  },
  firstName: {
    name: 'First Name',
    type: 'text',
    required: true,
    minLength: 1,
    maxLength: 50,
    errorMessage: 'First name is required'
  },
  middleName: {
    name: 'Middle Name',
    type: 'text',
    required: false,
    maxLength: 50
  },
  lastName: {
    name: 'Last Name',
    type: 'text',
    required: true,
    minLength: 1,
    maxLength: 50,
    errorMessage: 'Last name is required'
  },
  dateOfBirth: {
    name: 'Date of Birth',
    type: 'date',
    required: true,
    pattern: /^\d{2}\/\d{2}\/\d{4}$/,
    errorMessage: 'Format: DD/MM/YYYY'
  },
  email: {
    name: 'Email',
    type: 'email',
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: 'Must be a valid email address'
  },
  address1: {
    name: 'Address Line 1',
    type: 'text',
    required: true,
    minLength: 1,
    maxLength: 100,
    errorMessage: 'Address line 1 is required'
  },
  address2: {
    name: 'Address Line 2',
    type: 'text',
    required: false,
    maxLength: 100
  },
  address3: {
    name: 'Address Line 3',
    type: 'text',
    required: false,
    maxLength: 100
  },
  landmark: {
    name: 'Landmark',
    type: 'text',
    required: false,
    maxLength: 100
  },
  pinCode: {
    name: 'Pin Code',
    type: 'text',
    required: true,
    pattern: /^\d{6}$/,
    minLength: 6,
    maxLength: 6,
    errorMessage: 'Must be exactly 6 digits'
  },
  state: {
    name: 'State',
    type: 'text',
    required: true,
    minLength: 1,
    maxLength: 50,
    errorMessage: 'State is required'
  },
  city: {
    name: 'City',
    type: 'text',
    required: true,
    minLength: 1,
    maxLength: 50,
    errorMessage: 'City is required'
  },
  monthlyIncome: {
    name: 'Monthly Income',
    type: 'text',
    required: true,
    pattern: /^[\d,]+$/,
    errorMessage: 'Must be a valid number (can include commas)'
  },
  monthlyExpenses: {
    name: 'Monthly Expenses',
    type: 'text',
    required: true,
    pattern: /^[\d,]+$/,
    errorMessage: 'Must be a valid number (can include commas)'
  },
  maritalStatus: {
    name: 'Marital Status',
    type: 'select',
    required: true,
    options: ['single', 'married'],
    errorMessage: 'Please select marital status'
  },
  premiumMode: {
    name: 'Premium Mode',
    type: 'text',
    required: true,
    pattern: /^\d+$/,
    errorMessage: 'Must be a valid number'
  },
  premiumChannel: {
    name: 'Premium Channel',
    type: 'text',
    required: true,
    pattern: /^\d+$/,
    errorMessage: 'Must be a valid number'
  },
  premiumFrequency: {
    name: 'Premium Frequency',
    type: 'text',
    required: true,
    pattern: /^\d+$/,
    errorMessage: 'Must be a valid number'
  },
  planOption: {
    name: 'Plan Option',
    type: 'text',
    required: true,
    pattern: /^\d+$/,
    errorMessage: 'Must be a valid number'
  },
  premiumAmount: {
    name: 'Premium Amount',
    type: 'text',
    required: true,
    pattern: /^[\d,]+$/,
    errorMessage: 'Must be a valid number (can include commas)'
  }
};

export function validateField(fieldName: string, value: string): { valid: boolean; error?: string } {
  const validation = pramericaFieldValidations[fieldName];
  if (!validation) return { valid: true };

  if (validation.required && (!value || value.trim() === '')) {
    return { valid: false, error: `${validation.name} is required` };
  }

  if (validation.pattern && value && !validation.pattern.test(value)) {
    return { valid: false, error: validation.errorMessage || `Invalid ${validation.name}` };
  }

  if (validation.minLength && value.length < validation.minLength) {
    return { valid: false, error: `${validation.name} must be at least ${validation.minLength} characters` };
  }

  if (validation.maxLength && value.length > validation.maxLength) {
    return { valid: false, error: `${validation.name} must not exceed ${validation.maxLength} characters` };
  }

  if (validation.options && !validation.options.includes(value)) {
    return { valid: false, error: `${validation.name} must be one of: ${validation.options.join(', ')}` };
  }

  return { valid: true };
}

export function validateAllFields(data: Record<string, string>): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  let valid = true;

  Object.keys(pramericaFieldValidations).forEach(fieldName => {
    const result = validateField(fieldName, data[fieldName] || '');
    if (!result.valid) {
      valid = false;
      errors[fieldName] = result.error || 'Invalid value';
    }
  });

  return { valid, errors };
}
