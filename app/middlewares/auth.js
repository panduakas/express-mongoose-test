/* eslint-disable consistent-return */
const get = require('lodash/get');
const basicAuthModule = require('basic-auth');
const jwt = require('express-jwt');
const { AESDecrypt, AESCBCDecryptWithKey } = require('../libs/encryption');
const userModel = require('../models/user.model');

const { ErrorUnauthorized } = require('../helpers');

const secretCallback = (req, payload, done) => {
  const getEmail = get(payload, 'sub');

  userModel.findOne({ emailAddress: getEmail })
    .then(async (result) => {
      const getKey = get(result, 'key');
      const decryptRawKey = AESDecrypt(getKey);
      const originalKey = get(decryptRawKey, 'key');
      const getIssuer = get(payload, 'iss');
      const getIat = get(payload, 'iat');
      const decryptIssuer = AESCBCDecryptWithKey(originalKey, `${getIat}000`, getIssuer);
      if (decryptIssuer !== getEmail) throw new ErrorUnauthorized();

      const signature = Buffer.from(`${originalKey}`).toString('base64');
      done(null, signature);
    })
    .catch((e) => {
      done(null, e);
    });
};

const authJWT = () => jwt({ secret: secretCallback, algorithms: ['HS256'] });

const basicAuth = () => async (req, res, next) => {
  try {
    const user = basicAuthModule(req);
    if (!user) {
      throw new Error();
    }

    const nameBasic = get(user, 'name');
    const passBasic = get(user, 'pass');
    if (
      nameBasic !== process.env.AUTH_NAME ||
      passBasic !== process.env.AUTH_PASS
    ) {
      throw new Error();
    } else {
      next();
    }
  } catch (error) {
    res.status(404);
    // if (error.message === 'user') {
    //   res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    // }
    res.json({
      status: 404,
      success: false,
      message: 'Resource not found',
      data: null,
    });
  }
};
module.exports = {
  authJWT,
  basicAuth,
};
