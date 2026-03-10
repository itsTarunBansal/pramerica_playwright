import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY_STRING = (process.env.NODE_ENV==='production'? '52c648922daf52ee3fcf68e9fab908b0':'d9db6a2963e5a97b3189598fe475d3d0').padEnd(32, '0').slice(0, 32);

export const decryptField = (encryptedText: string): string => {
  if (!encryptedText) return encryptedText;
  if (!encryptedText.includes(':')) return encryptedText;
  
  try {
    const [ivHex, encryptedHex] = encryptedText.split(':');
    if (!ivHex || !encryptedHex) return encryptedText;
    
    const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY_STRING);
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const ciphertext = CryptoJS.enc.Hex.parse(encryptedHex);
    
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext } as any,
      key,
      { 
        iv, 
        mode: CryptoJS.mode.CBC, 
        padding: CryptoJS.pad.Pkcs7 
      }
    );
    
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!result) {
      console.error('Decryption failed - empty result. Key might be wrong.', {
        keyLength: ENCRYPTION_KEY_STRING.length,
        keyPreview: ENCRYPTION_KEY_STRING.substring(0, 10) + '...',
        ivLength: ivHex.length,
        encryptedLength: encryptedHex.length
      });
      return encryptedText;
    }
    
    return result;
  } catch (error) {
    console.error('Decryption error:', error, encryptedText);
    return encryptedText;
  }
};

export const decryptApplication = (app: any) => {
  const decrypted = {
    ...app,
    panNumber: decryptField(app.panNumber),
    candidateName: decryptField(app.candidateName),
    email: decryptField(app.email),
    emailId: decryptField(app.emailId || app.email),
    mobile: decryptField(app.mobile),
    mobileNumber: decryptField(app.mobileNumber || app.mobile),
    phoneNumber: decryptField(app.phoneNumber || app.mobile),
    fatherName: app.fatherName ? decryptField(app.fatherName) : app.fatherName,
  };
  
  return decrypted;
};
