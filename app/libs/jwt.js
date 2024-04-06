const CryptoJS = require('crypto-js');

const base64url = (source) => {
  // Encode in classical base64
  const encodedSource = CryptoJS.enc.Base64.stringify(source);

  // Replace characters according to base64url specifications & Remove padding equal characters
  const result = encodedSource.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return result;
};

const generateJwt = (header = {}, dataEncode = {}, jwtSecret) => {
  // encode header
  const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
  const encodedHeader = base64url(stringifiedHeader);

  // encode data
  const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(dataEncode));
  const encodedData = base64url(stringifiedData);

  // build token
  const token = `${encodedHeader}.${encodedData}`;

  // sign token
  let signature = CryptoJS.HmacSHA256(token, jwtSecret);
  signature = base64url(signature);
  const signedToken = `${token}.${signature}`;

  return signedToken;
};

module.exports = {
  base64url,
  generateJwt,
};
