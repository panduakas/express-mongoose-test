const jwt = require('jsonwebtoken');
const get = require('lodash/get');
const upperCase = require('lodash/upperCase');
const cuid = require('cuid');
const CryptoJS = require('crypto-js');
const moment = require('moment-timezone');

const UserSchema = require('../../models/user.model');
const TokenSchema = require('../../models/token.model');
const { AESDecrypt, AESCBCEncryptWithKey, AESEncrypt } = require('../../libs/encryption');
const { jwtExpirationInterval } = require('../../config/variables');

class User {
  static async verifyRefreshToken({ refreshToken }) {
    const verifyToken = jwt.verify(refreshToken, Buffer.from(`${process.env.JWT_SECRET_REFRESH}`).toString('base64'));
    const getIssuer = get(verifyToken, 'iss');
    const getVkey = get(verifyToken, 'vKey');
    const decryptVkey = AESDecrypt(getVkey);
    const decryptIssuer = AESDecrypt(getIssuer);
    const getDetail = await UserSchema.findOne({ emailAddress: decryptVkey });
    const getKey = get(getDetail, 'key');
    const decryptRawKey = AESDecrypt(getKey);
    const originalKey = get(decryptRawKey, 'key');
    const getDetailCurrentToken = await TokenSchema.findOne({ userEmail: decryptVkey });
    const verifyTokenCurrrent = jwt.verify(get(getDetailCurrentToken, 'token'), Buffer.from(`${originalKey}`).toString('base64'));
    if (decryptIssuer !== get(verifyTokenCurrrent, 'iss')) throw new Error('Invalid refresh token provided');
    const data = {
      sub: decryptVkey,
      createdAt: new Date(),
    };
    const newIat = moment().unix();
    const issuer = AESCBCEncryptWithKey(get(getDetail, 'key'), `${newIat}000`, decryptVkey);
    const accessTokenNew = jwt.sign({
      nbf: 0,
      iat: newIat,
      typ: 'Bearer',
      ...data,
    }, Buffer.from(`${originalKey}`).toString('base64'), {
      expiresIn: moment().add(jwtExpirationInterval, 'minutes').unix(),
      issuer,
    });

    const result = await TokenSchema.findOneAndUpdate({
      userEmail: decryptVkey
    }, {
      token: accessTokenNew,
      expires: moment().add(jwtExpirationInterval, 'minutes').toDate()
    });

    const refreshTokenNew = this.refresh({ token: accessTokenNew, key: originalKey });

    return { accessToken: accessTokenNew, refreshToken: refreshTokenNew, result };
  }

  static refresh({ token, key }) {
    const verifyToken = jwt.verify(token, Buffer.from(`${key}`).toString('base64'));
    const issuer = AESEncrypt(get(verifyToken, 'iss'));
    const vKey = AESEncrypt(get(verifyToken, 'sub'));

    const refreshToken = jwt.sign({
      nbf: 0,
      typ: 'Bearer',
      vKey,
    }, Buffer.from(`${process.env.JWT_SECRET_REFRESH}`).toString('base64'), {
      expiresIn: moment().add(jwtExpirationInterval * 1440, 'minutes').unix(), issuer
    });

    return refreshToken;
  }

  static token({
    emailAddress,
    key,
    userId,
  }) {
    const data = {
      sub: emailAddress,
      createdAt: new Date(),
    };
    const decryptKey = AESDecrypt(key);
    const originalKey = get(decryptKey, 'key');

    const iat = moment().unix();
    const issuer = AESCBCEncryptWithKey(originalKey, `${iat}000`, emailAddress);
    const accessToken = jwt.sign({
      nbf: 0,
      iat,
      typ: 'Bearer',
      ...data,
    }, Buffer.from(`${originalKey}`).toString('base64'), {
      expiresIn: moment().add(jwtExpirationInterval, 'minutes').unix(),
      issuer,
    });

    const refreshToken = this.refresh({ token: accessToken, key: originalKey });

    TokenSchema.findOneAndUpdate({
      userEmail: emailAddress
    }, {
      token: accessToken,
      expires: moment().add(jwtExpirationInterval, 'minutes').toDate()
    })
      .then((result) => {
        if (!result) {
          const tokenObject = new TokenSchema({
            userEmail: emailAddress,
            userId,
            token: accessToken,
            expires: moment().add(jwtExpirationInterval, 'minutes').toDate()
          }).save();
          return tokenObject;
        }
        return '';
      })
      .catch(() => ({}));

    return { accessToken, refreshToken };
  }

  static generateIdentityNumber() {
    const result = `IN${upperCase(cuid()).replace(/ /g, '')}`;
    return result;
  }

  static getKeyEncrypt() {
    const getKey = CryptoJS.lib.WordArray.random(256 / 16);
    const key = getKey.toString();
    const encryptKey = AESEncrypt({
      key,
    });

    return encryptKey;
  }

  static async register({
    userName,
    emailAddress,
    password,
    accountNumber,
  }) {
    try {
      const userData = {
        userName,
        emailAddress,
        accountNumber,
        password,
      };

      userData.key = this.getKeyEncrypt();
      userData.identityNumber = this.generateIdentityNumber();

      const user = await new UserSchema(userData).save();
      const result = user.transform();
      return result;
    } catch (error) {
      const keyValue = get(error, 'errorResponse.keyValue');
      const propertyName = Object.keys(keyValue)[0];
      if (get(error, 'errorResponse.code') === 11000) throw new Error(`${propertyName} already registered`);
      return '';
    }
  }
}

module.exports = {
  User
};
