/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const omitBy = require('lodash/omitBy');
const isNil = require('lodash/isNil');
const bcrypt = require('bcrypt');

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  accountNumber: {
    type: String,
    maxlength: 128,
    unique: true,
    index: true,
    trim: true,
  },
  emailAddress: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  identityNumber: {
    type: String,
    maxlength: 128,
    unique: true,
    index: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
  },
  key: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
  },
}, {
  timestamps: true,
});

userSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();

    const rounds = Number(process.env.BCRYPT_SALT);

    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
userSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      'id',
      'accountNumber',
      'userName',
      'emailAddress',
      'identityNumber',
      'createdAt'
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
userSchema.statics = {
  list({
    page = 1, perPage = 30, userName, emailAddress
  }) {
    const options = omitBy({ userName, emailAddress }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  checkDuplicateEmail(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new Error('Email Address already exists');
    }
    return error;
  },
};

module.exports = mongoose.model('User', userSchema);
