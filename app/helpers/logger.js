const pickBy = require('lodash/pickBy');
const identity = require('lodash/identity');
const fastSafeStringify = require('fast-safe-stringify');
const winstonLogger = require('../config/logger');

const handleLoggerparams = ({
  data,
  message,
  method,
  mep,
  toService,
  statusCode,
  requestId,
  fromService,
  label,
  env,
}) => ({
  data: fastSafeStringify(data, null, 2),
  requestId,
  message,
  method,
  mep, // message exchange pattern
  toService,
  statusCode,
  fromService,
  labelService: label,
  env,
});

const logInfo = async (params) => {
  const data = pickBy(params, identity);
  const log = handleLoggerparams(data);
  winstonLogger.info(log);
};

const logError = async (params) => {
  const data = pickBy(params, identity);
  const log = handleLoggerparams(data);
  winstonLogger.error(log);
};


module.exports = {
  logInfo,
  logError,
};
