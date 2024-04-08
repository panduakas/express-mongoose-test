const handler = require('./handler');
const requestLog = require('./httpRequestLog');
const requestLogInfo = require('./httpRequestLogInfo');
const limit = require('./limit');
const auth = require('./auth');
const bodyParser = require('./bodyParser');

module.exports = {
  ...handler,
  ...requestLog,
  ...limit,
  ...auth,
  ...bodyParser,
  ...requestLogInfo,
};
