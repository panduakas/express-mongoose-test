module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'detect-unsafe-regex': true,
    'detect-buffer-noassert': true,
    'no-var': 1,
    'no-let': true,
    'prefer-const': 1,
    'arrow-parens': 0,
    'comma-dangle': 0,
    'operator-linebreak': 0,
    'implicit-arrow-linebreak': 0,
  },
};
