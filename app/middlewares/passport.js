/* eslint-disable consistent-return */
const get = require('lodash/get');
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const UserSchema = require('../models/user.model');

module.exports = passport.use(
  new LocalStrategy(
    {
      usernameField: 'userName',
      passwordField: 'password',
    },
    async (userName, password, done) => {
      try {
        const userData = await UserSchema.findOne({ userName }).exec();

        if (!userData) return done(null, false, { message: 'Invalid username or password!' });

        const match = await bcrypt.compare(password, get(userData, 'password'));

        if (!match) {
          done(null, false, { message: 'Invalid username or password!' });
        } else {
          return done(null, userData);
        }
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  UserSchema.findById(id, (err, user) => {
    done(err, user);
  }).exec();
});
