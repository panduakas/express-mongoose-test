const getBodyRaw = (req, res, next) => {
  let data = '';
  req.on('data', (chunk) => { data += chunk; });
  req.on('end', () => {
    if (typeof data === 'string') req.body = { data };
    next();
  });
};

const bodyLookup = (req, res, next) => {
  // add logic here
  next();
};

module.exports = {
  getBodyRaw,
  bodyLookup,
};
