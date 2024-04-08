/* eslint-disable no-console */
const clone = require('clone');
const cuid = require('cuid');
const get = require('lodash/get');
const { logInfo } = require('../helpers');

const requestLogInfo = async (req, res, next) => {
  const {
    baseUrl,
    originalUrl,
    method,
    query,
    params,
    body,
    ip,
    headers,
  } = req;

  const data = {
    query,
    params,
    body,
    headers,
    ip,
  };

  data.ipAddress = get(req, 'clientIp');

  const requestId = cuid();
  process.requestId = requestId;
  res.requestId = requestId;
  req.requestId = requestId;
  res.logOnResponse = true;

  const cloneData = clone(data);

  if (Object.entries(query).length === 0 && query.constructor === Object) {
    delete data.query;
  }
  if (Object.entries(params).length === 0 && params.constructor === Object) {
    delete data.params;
  }

  logInfo(
    {
      data: cloneData,
      method,
      message: `REQUEST TO: ${baseUrl || originalUrl}`,
      mep: 'REQUEST',
      service: 'svc-be-topup',
    },
    get(req, 'requestId')
  );

  res.method = method;
  next();
};

module.exports = {
  requestLogInfo,
};
