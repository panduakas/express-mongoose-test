/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const Queue = require('bull');
const get = require('lodash/get');
const { User } = require('./user');
const userModel = require('../..//models/user.model');

// bull queue using redis to cache data
const queue = new Queue('Operation');

class Opertation extends User {
  static queue() {
    return queue.process(async (job) => {
      // add logic here
      const getQuery = get(job, 'data');
      console.log('🚀 | Opertation | returnqueue.process | getQuery:', getQuery);

      const operation = await userModel.findOneAndUpdate({
        accountNumber: get(getQuery, 'data.accountNumber'),
      }, {
        identityNumber: this.generateIdentityNumber()
      });

      return operation;
    });
  }
}

module.exports = {
  Opertation
};
