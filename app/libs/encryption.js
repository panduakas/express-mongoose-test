const CryptoJS = require('crypto-js');

const configSecurity = {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.AnsiX923,
};
const keyPromise = CryptoJS.enc.Utf8.parse(process.env.ENCRYPT_KEY);
const keyPromiseCbc = process.env.ENCRYPT_KEY_CBC;

const AESDecrypt = (data) => {
  const convertToBase64 = CryptoJS.enc.Base64.parse(data);
  const decrypt = CryptoJS.AES.decrypt({
    ciphertext: convertToBase64,
    salt: '',
  }, keyPromise, configSecurity);
  return JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
};

const AESEncrypt = data => (CryptoJS.AES.encrypt(JSON.stringify(data), keyPromise, configSecurity)
  .toString());

const Base64 = (clientId, clientSecret) => {
  const encodedData = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  return `Basic ${encodedData}`;
};

const AESCBCEncrypt = (iv, txt = '') => {
  const cipher = CryptoJS.AES.encrypt(txt, CryptoJS.enc.Utf8.parse(keyPromiseCbc), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
  });

  return cipher.toString();
};

const AESCBCDecrypt = (iv, txt = '') => {
  const cipher = CryptoJS.AES.decrypt(txt, CryptoJS.enc.Utf8.parse(keyPromiseCbc), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
  });

  return CryptoJS.enc.Utf8.stringify(cipher).toString();
};

const AESCBCEncryptWithKey = (secretKey, iv, txt = '') => {
  const cipher = CryptoJS.AES.encrypt(txt, CryptoJS.enc.Utf8.parse(secretKey), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
  });

  return cipher.toString();
};

const AESCBCDecryptWithKey = (secretKey, iv, txt = '') => {
  const cipher = CryptoJS.AES.decrypt(txt, CryptoJS.enc.Utf8.parse(secretKey), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
  });

  return CryptoJS.enc.Utf8.stringify(cipher).toString();
};

module.exports = {
  AESDecrypt,
  AESEncrypt,
  Base64,
  AESCBCEncrypt,
  AESCBCDecrypt,
  AESCBCDecryptWithKey,
  AESCBCEncryptWithKey,
};
