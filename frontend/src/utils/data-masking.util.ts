const SENSITIVE_PATTERNS = [
  /password/i,
  /pwd/i,
  /pass/i,
  /token/i,
  /authorization/i,
  /bearer/i,
  /secret/i,
  /api[_-]?key/i,
  /pan/i,
  /aadhaar/i,
  /aadhar/i,
  /account/i,
  /card/i,
  /cvv/i,
  /otp/i,
  /pin/i,
];

export function maskSensitiveData(data: any): any {
  if (!data) return data;
  
  if (typeof data === 'string') {
    return data.length > 100 ? data.substring(0, 100) + '...' : data;
  }

  if (Array.isArray(data)) {
    return data.map(item => maskSensitiveData(item));
  }

  if (typeof data === 'object') {
    const masked: any = {};
    
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const isSensitive = SENSITIVE_PATTERNS.some(pattern => pattern.test(key));
        
        if (isSensitive) {
          masked[key] = '***MASKED***';
        } else if (typeof data[key] === 'object') {
          masked[key] = maskSensitiveData(data[key]);
        } else {
          masked[key] = data[key];
        }
      }
    }
    
    return masked;
  }

  return data;
}
