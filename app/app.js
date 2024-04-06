/* eslint-disable no-console */
// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
require('./config/logger');
const { port } = require('./config/variables');
const app = require('./config/express');
const mongoose = require('./config/mongoose');

// open mongoose connection
mongoose.connect();

// listen to requests
app.listen(port, () => console.log(`App listening on port ${port}`))
  .setTimeout(3000000);

/**
* Exports express
* @public
*/
module.exports = app;
