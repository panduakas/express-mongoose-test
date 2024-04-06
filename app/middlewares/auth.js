/* eslint-disable consistent-return */
const get = require('lodash/get');
const basicAuthModule = require('basic-auth');
// const passport = require('passport');
// const jwt = require('express-jwt');
// const {
//   AESDecrypt,
// } = require('../libs');

// const { ErrorUnauthorized, httpStatus, errorResponse } = require('../helpers');

// const secretCallback = (req, payload, done) => {
//   const getIssuer = get(payload, 'iss');
//   const getId = get(payload, 'jti');
//   const decryptIssuer = AESDecrypt(getIssuer);
//   const decryptId = AESDecrypt(getId);

//   getOnePartnerById(get(decryptId, 'jti'))
//     .then(async (result) => {
//       const secret = AESDecrypt(get(result, 'key'));
//       const getName = get(decryptIssuer, 'name');
//       const getUsername = get(result, 'username');
//       const getUserData = get(req, 'session.user');
//       if (!getUserData) throw new ErrorUnauthorized('UNAUTHORIZED');
//       if (get(secret, 'key') !== get(getUserData, 'key')) {
//         throw new ErrorUnauthorized('UNAUTHORIZED');
//       }
//       if (getName !== getUsername) throw new ErrorUnauthorized('UNAUTHORIZED');

//       const signature = Buffer.from(`${get(secret, 'key')}`).toString('base64');
//       done(null, signature);
//     })
//     .catch((err) => {
//       done(null, err);
//     });
// };

// const authJWT = () => jwt({ secret: secretCallback, algorithms: ['HS256'] });

// const authPassport = () => (req, res, next) => {
//   passport.authenticate('jwt', { session: false }, (err, user, info) => {
//     if (err) return res.status(get(err, 'status') || get(res, 'statusCode') ||
//  httpStatus.unauthorized).json(errorResponse(res, err));
//     if (!user) {
//       const error = {};
//       error.message = get(info, 'message');
//       error.status = get(info, 'status');
//       return res
//         .status(httpStatus.unauthorized).json(errorResponse(res, error));
//     }

//     req.user = user;
//     next();
//   })(req, res, next);
// };
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
  // authJWT,
  // authPassport,
  basicAuth,
};
