const rateLimit = require('express-rate-limit');

const limit = rateLimit({
  max: 10000000, // max requests
  windowMs: 60 * 60 * 1000, // 1 Hour of 'ban' / lockout
  message: 'Too many requests', // message to send
});

module.exports = {
  limit,
};
