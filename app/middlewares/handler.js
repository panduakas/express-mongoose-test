/* eslint-disable no-param-reassign */
const cuid = require('cuid');
const get = require('lodash/get');
const { errorResponse, httpStatus, logError } = require('../helpers');
// const { redisGet, redisSetex, ttl } = require('../libs');

const notFound = (req, res) => {
  const {
    baseUrl,
    originalUrl,
    method,
    query,
    params,
    body,
    ip,
    headers,
  } = res;
  logError({
    data: {
      baseUrl,
      originalUrl,
      method,
      query,
      params,
      body,
      ip,
      headers,
    },
    message: 'Not found handler log',
    mep: 'RESPONSE',
  });
  res.status(httpStatus.notFound).json({
    status: httpStatus.notFound,
    success: false,
    message: 'Resource not found',
    data: null,
  });
};

const reqId = async (req, res, next) => {
  req.requestId = cuid();

  process.requestId = req.requestId;
  next();
  return req.requestId;
};

const errorHandler = (err, req, res) => errorResponse(res, err);

const syntaxErrorHandler = (error, req, res, next) => {
  if (error instanceof SyntaxError) {
    error.message = 'Unexpected Error';
    error.status = httpStatus.expectationFail;
    logError({
      data: {
        error,
      },
      message: 'Syntax Error handler log',
      mep: 'RESPONSE',
    });
    res.status(httpStatus.expectationFail).json(errorResponse(res, error));
  } else {
    next();
  }
};

const unauthorizedErrorHandler = (err, req, res, next) => {
  const errName = get(err, 'name');
  if (errName === 'UnauthorizedError' || errName === 'SyntaxError') {
    logError({
      data: {
        err,
      },
      message: 'UnauthorizedError handler log',
      mep: 'RESPONSE',
    });
    res.status(401).json({
      status: 401,
      success: false,
      message: 'UNAUTHORIZED',
      data: null,
    });
  } else if (errName === 'ErrorTooManyRequests') {
    logError({
      data: {
        err,
      },
      message: 'ErrorTooManyRequests handler log',
      mep: 'RESPONSE',
    });
    res.status(429).json({
      status: 429,
      success: false,
      message: 'TOO MANY REQUESTS',
      data: null,
    });
  } else {
    next();
  }
};

module.exports = {
  notFound,
  reqId,
  errorHandler,
  syntaxErrorHandler,
  unauthorizedErrorHandler,
};
