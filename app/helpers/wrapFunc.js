const get = require('lodash/get');
const { logError } = require('./logger');

const service = process.env.SERVICE_NAME;

const wrap = async (fn, errorMessage) => {
  try {
    const result = await fn;
    return result;
  } catch (error) {
    logError({
      service: 'svc-core',
      data: get(error, 'data') || get(error, 'message') || error,
      message: 'DATABASE ERROR',
      method: 'DATABASE',
      toService: service,
      mep: 'REQUEST',
    });
    throw new Error(errorMessage);
  }
};

module.exports = wrap;
