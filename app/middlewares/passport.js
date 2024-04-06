// /* eslint-disable consistent-return */
// const get = require('lodash/get');
// const passport = require('passport');
// const bcrypt = require('bcrypt');
// const LocalStrategy = require('passport-local').Strategy;
// const JwtStrategy = require('passport-jwt').Strategy;
// const { ExtractJwt } = require('passport-jwt');
// const { Operators } = require('../db/models/Mysql/initiate/operators');
// const { ErrorUnauthorized } = require('../helpers');
// const { AESDecrypt, AESCBCDecryptWithKey } = require('../libs');

// module.exports = passport.use(
//   new LocalStrategy(
//     {
//       usernameField: 'username',
//       passwordField: 'password',
//     },
//     async (email, password, done) => {
//       try {
//         const userData = await Operators.findOne({ where: { email } });

//         if (!userData) return done(null, false, { message: 'Invalid username or password!' });

//         const match = await bcrypt.compare(password, get(userData, 'password'));
//         if (!match) {
//           done(null, false, { message: 'Invalid username or password!' });
//         } else {
//           return done(null, userData);
//         }
//       } catch (error) {
//         return done(error);
//       }
//     },
//   ),
// );

// passport.use(
//   new JwtStrategy(
//     {
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: Buffer.from(`${process.env.JWT_SECRET}`).toString('base64'),
//     },
//     async (jwtPayload, done) => {
//       try {
//         const email = get(jwtPayload, 'email');
//         const userData = await Operators.findOne({ where: { email } });
//         if (!userData) throw new ErrorUnauthorized('UNAUTHORIZED');
//         const encryptedIssuser = get(jwtPayload, 'iss');
//         const decryptKey = AESDecrypt(get(userData, 'key'));
//         const getIat = get(jwtPayload, 'iat');
//         const username = AESCBCDecryptWithKey(get(decryptKey, 'key'), `
// ${getIat}000`, encryptedIssuser);

//         if (!username) throw new ErrorUnauthorized('UNAUTHORIZED');
//         if (!userData) {
//           throw new ErrorUnauthorized('UNAUTHORIZED');
//         } else {
//           if (get(userData, 'username') !== username)
// throw new ErrorUnauthorized('UNAUTHORIZED');
//           const output = userData.toJSON();
//           delete output.password;
//           return done(null, output);
//         }
//       } catch (error) {
//         return done(error);
//       }
//     },
//   ),
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   Operators.findByPk(id, (err, user) => {
//     done(err, user);
//   });
// });
