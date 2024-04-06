/* eslint-disable no-param-reassign */

const isNumber = require('lodash/isNumber');
const toNumber = require('lodash/toNumber');
const isNull = require('lodash/isNull');
const get = require('lodash/get');
const moment = require('moment');
const { logInfo, logError } = require('./logger');
const { httpStatus } = require('./codes');

const successResponse = (res, data) => {
  const { method, statusCode } = res;
  const shelter = {};
  const statusResult = Number(get(data, 'status'));
  const statusLog = get(res, 'logOnResponse');

  if (!statusResult) {
    shelter.status = httpStatus.ok;
  } else {
    shelter.status = statusResult;
  }

  const payload = {
    status: get(data, 'nonHttpStatusCode') || get(shelter, 'status'),
    success: true,
    message: get(data, 'message') || 'Success',
    data: get(data, 'data') || data,
  };

  if (statusLog === true) {
    logInfo(
      {
        method,
        statusCode,
        data: payload,
        message: `API RESPONSE: ${payload.message}`,
        mep: 'RESPONSE',
      },
      get(res, 'requestId')
    );
  }

  return payload;
};

const errorResponse = (res, e) => {
  const { method, statusCode } = res;
  const shelter = {};
  const statusResult = Number(get(e, 'status'));
  const statusLog = get(res, 'logOnResponse');

  if (!statusResult) {
    shelter.status = httpStatus.badRequest;
  } else {
    shelter.status = statusResult;
  }

  const payload = {
    status:
      get(e, 'nonHttpStatusCode') ||
      get(shelter, 'status') ||
      httpStatus.badRequest,
    success: false,
    message:
      (get(e, 'error') && get(e.error, 'message')) ||
      (get(e, 'message') && get(e.original, 'code')) ||
      get(e, 'message'),
    data: get(e, 'data') || null,
  };

  if (statusLog === true) {
    logError(
      {
        method,
        statusCode,
        data: payload,
        message: `API RESPONSE: ${payload.message}`,
        mep: 'RESPONSE',
      },
      get(res, 'requestId')
    );
  }

  return payload;
};

const paging = (page = 1, limit = 10) => {
  if (page === 0 || isNull(page)) page = 1;

  if (isNull(limit)) limit = 10;

  const getPage = isNumber(page) ? page : toNumber(page);
  const getLimit = isNumber(limit) ? limit : toNumber(limit);

  return {
    page: getPage,
    limit: getLimit,
    offset: Math.abs((getPage - 1) * getLimit),
  };
};

const transformSpecs = (input, fieldLength) => {
  const result = String(input);
  if (result.length <= fieldLength) {
    return result;
  }
  return result.substring(0, fieldLength);
};

const setPhoneNo = (phoneNo) => {
  if (!phoneNo) return null;

  let result = phoneNo.replace('+', '');
  if (result.charAt(0) === '6' && result.charAt(1) === '2') {
    result = `${result.slice(2)}`;
  } else if (result.charAt(0) === '0') {
    result = `${result.slice(1)}`;
  }

  return result;
};

const logPayload = ({
  requestPayload,
  responsePayload,
  requestId,
  dateStart,
  elapsedTime,
}) => ({
  requestPayload: requestPayload || null,
  responsePayload: responsePayload || null,
  requestId: requestId || null,
  dateStart: dateStart || null,
  elapsedTime: elapsedTime || null,
  dateNow: moment()
    .utcOffset('+07:00')
    .format(),
});

module.exports = {
  errorResponse,
  successResponse,
  paging,
  transformSpecs,
  setPhoneNo,
  logPayload,
};
