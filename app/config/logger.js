const winston = require('winston');

require('winston-daily-rotate-file');
const {
  existsSync,
  mkdirSync,
} = require('fs');
const { logDir } = require('./variables');

const dirname = `${logDir}`;

if (!existsSync(logDir)) mkdirSync(logDir);

// Daily rotate generate file log
const transport = new winston.transports.DailyRotateFile({
  filename: '%DATE%.log',
  dirname,
  datePattern: 'YYYY-MM-DD',
  maxSize: '100m',
});

// instantiate a new Winston Logger with the settings defined above
const winstonLogger = new winston.Logger({
  transports: [transport],
  exitOnError: false, // do not exit on handled exceptions
});

module.exports = winstonLogger;
