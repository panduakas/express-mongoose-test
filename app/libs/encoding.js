const CryptoJS = require('crypto-js');

// eslint-disable-next-line no-useless-escape
const toBase64Url = (text = '') => text.replace(/\+/gi, '-').replace(/\//gi, '_').replace(/\=/gi, '');

const hmacBase64Url = ({
  text = '',
  secret = '',
}) => {
  const signingHmac = CryptoJS.HmacSHA256(text, secret);
  const encoding = CryptoJS.enc.Base64.stringify(signingHmac);
  const result = toBase64Url(encoding);
  return result;
};

const sha256Digest = (data = {}) => {
  const stringifyInputData = JSON.stringify(data);
  const signingSha256 = CryptoJS.SHA256(stringifyInputData);
  const hexEncode = CryptoJS.enc.Hex.stringify(signingSha256);
  const wordArray = CryptoJS.enc.Utf8.parse(hexEncode);
  const encoding = CryptoJS.enc.Base64.stringify(wordArray);
  const result = toBase64Url(encoding);
  return result;
};

const base64UrlEncoding = (data = {}) => toBase64Url(
  CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(data))),
);

const hashMD5 = (text = '') => {
  const input = String(text);
  const hashText = CryptoJS.MD5(input);
  const result = hashText.toString(CryptoJS.enc.Hex);
  return result;
};

const hmacSHA256encode = ({
  text = '',
  secret = '',
}) => {
  const signingHmac = CryptoJS.HmacSHA256(text, secret);
  const result = CryptoJS.enc.Hex.stringify(signingHmac);
  return result;
};

module.exports = {
  hmacBase64Url,
  sha256Digest,
  base64UrlEncoding,
  toBase64Url,
  hashMD5,
  hmacSHA256encode,
};
