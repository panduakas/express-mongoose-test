const axios = require('axios');
const get = require('lodash/get');
const clone = require('clone');
const qs = require('qs');
const cuid = require('cuid');

const {
  logError,
  logPayload
} = require('../helpers');

const sendRequestNoLog = async ({
  toService,
  url,
  method,
  data,
  params,
  optHeaders,
  requestId,
}) => {
  const start = Date.now();

  const shelter = {};
  shelter.contentType = 'application/json';
  shelter.dataParse = data;

  if (optHeaders) {
    shelter.contentType = get(optHeaders, 'contentType');

    if (get(shelter, 'contentType') !== 'application/json') {
      shelter.dataParse = qs.stringify(data);
    }
  }

  const headers = {
    'Content-Type': get(shelter, 'contentType'),
    ...optHeaders,
  };

  delete headers.contentType;

  const requestConfig = {
    method,
    url,
    headers,
    data: get(shelter, 'dataParse'),
    params,
  };

  const cloneRequestConfig = clone(requestConfig);

  if (get(cloneRequestConfig && cloneRequestConfig.headers, 'authorization')) {
    cloneRequestConfig.headers.authorization = '*';
  }

  try {
    const req = await axios(requestConfig);

    const response = get(req, 'data');
    const getStatus = get(req, 'status');
    const toStringStatus = String(getStatus);

    if (toStringStatus.charAt(0) !== '2') {
      throw Object.assign(new Error(get(response, 'message')), {
        data: get(response, 'data'),
        status: getStatus,
      });
    }

    return response;
  } catch (error) {
    const response = get(error, 'response');
    const getData = get(response, 'data');

    const payloadLogError = {
      data: logPayload({
        requestPayload: cloneRequestConfig,
        responsePayload: getData,
        requestId: requestId || cuid(),
        elapsedTime: `${(Date.now() - start) / 1000} s`,
      }),
      message:
        get(response, 'message') ||
        get(getData, 'errorMessage') ||
        get(getData, 'error_description') ||
        `Failed send request to ${url}`,
      method,
      mep: 'RESPONSE',
      toService,
      statusCode: get(response, 'status') || get(error, 'statusCode'),
    };

    logError(payloadLogError, requestId || cuid());

    throw Object.assign(
      new Error(
        get(getData, 'message') ||
          get(getData, 'errorMessage') ||
          get(getData, 'error_description') ||
          get(error, 'message') ||
          `Failed send request to ${url}`
      ),
      {
        status:
          get(getData, 'status') ||
          get(error, 'status') ||
          get(error.response, 'status'),
        data: null,
      }
    );
  }
};

module.exports = {
  sendRequestNoLog,
};
