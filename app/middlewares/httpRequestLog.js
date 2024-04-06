/* eslint-disable no-console */
// const clone = require('clone');
const cuid = require('cuid');
const get = require('lodash/get');

const requestLog = async (req, res, next) => {
  const {
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

  if (Object.entries(query).length === 0 && query.constructor === Object) {
    delete data.query;
  }
  if (Object.entries(params).length === 0 && params.constructor === Object) {
    delete data.params;
  }

  res.method = method;
  next();
};

module.exports = {
  requestLog,
};
