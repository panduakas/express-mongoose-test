/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
require('../middlewares/passport');

const requestIp = require('request-ip');
const express = require('express');
const enrouten = require('express-enrouten');
const get = require('lodash/get');
const expressValidator = require('express-validator');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const xss = require('xss-clean');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const passport = require('passport');

const {
  reqId,
  requestLogInfo,
  limit,
  syntaxErrorHandler,
  unauthorizedErrorHandler,
  bodyLookup,
  notFound
} = require('../middlewares');
const { httpStatus, errorResponse } = require('../helpers');
const { Opertation } = require('..//action/v1/operation');

const app = express();

app.use(requestIp.mw());
app.use(
  session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    resave: false,
    secret: 'ampunb4ngjag0',
    saveUninitialized: false,
  }),
);

app.use(expressValidator());
app.use(passport.initialize());


app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'PHP/7.47.0' }));
app.use(compress());
app.use(bodyLookup);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(
  bodyParser.json({
    limit: '10kb',
  }),
);
app.use(syntaxErrorHandler);
app.use(xss());
app.use(mongoSanitize());
app.use(limit);
app.use(reqId);
app.use(requestLogInfo);
Opertation.queue().catch(() => ({}));

// Routing
app.use('/', enrouten({ directory: '../routes' }));
app.use(unauthorizedErrorHandler);

// Not Found handler
app.use('*', notFound);

app.use((err, req, res) => res
  .status(
    get(err, 'status') || get(res, 'statusCode') || httpStatus.badRequest,
  )
  .json(errorResponse(res, err)));

module.exports = app;
