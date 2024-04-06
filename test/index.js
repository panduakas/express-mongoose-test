/* global */
require('dotenv').config();
const supertest = require('supertest');
const { assert } = require('chai');
const cuid = require('cuid');
const app = require('../app/app');
const { AESDecrypt, AESCBCEncrypt } = require('../app/libs');

const server = supertest(app);
const CREATED_BY = 'Unit_test1';
const timestamp = new Date().getTime().toString().padEnd(16, '0'); // timestamp 16 digit
const getUser = AESCBCEncrypt(timestamp, process.env.AUTH_NAME);
const getPass = AESCBCEncrypt(timestamp, process.env.AUTH_PASS);
const token = Buffer.from(`${getUser}:${getPass}`).toString('base64');

// const wrap = fn => () => fn().catch(error => assert.ifError(error));

const dataTest = {
  requestId: cuid(),
  createdBy: CREATED_BY,
  timestamp,
  token,
};
process.requestId = dataTest.requestId;

require('./ping.test')(server, assert, dataTest, AESDecrypt);
