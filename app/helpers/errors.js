const { httpStatus } = require('./codes');

class ErrorNotFound extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) Error.captureStackTrace(this, ErrorNotFound);

    this.name = 'ErrorNotFound';
    this.status = httpStatus.notFound;
    this.data = null;
  }
}

class ErrorUnauthorized extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) Error.captureStackTrace(this, ErrorUnauthorized);

    this.name = 'ErrorUnauthorized';
    this.status = httpStatus.unauthorized;
    this.data = null;
    this.message = this.message || 'UNAUTHORIZED';
  }
}

class ErrorForbidden extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) Error.captureStackTrace(this, ErrorForbidden);

    this.name = 'ErrorForbidden';
    this.status = httpStatus.forbidden;
    this.data = null;
  }
}

class ErrorTooManyRequests extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) Error.captureStackTrace(this, ErrorTooManyRequests);

    this.name = 'ErrorTooManyRequests';
    this.status = httpStatus.tooManyRequests;
    this.data = null;
    this.message = this.message || 'TOO MANY REQUESTS';
  }
}
module.exports = {
  ErrorNotFound,
  ErrorUnauthorized,
  ErrorForbidden,
  ErrorTooManyRequests,
};
