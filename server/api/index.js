'use strict';

const co = require('co');
const fs = require('fs');
const path = require('path');

const core = require('../../core');
const jwt = core.getService('jwt');
const db = core.getService('db');

const api = require('koa-router')();

// initialize api services
api.use(function* (next) {
  const ctx = this;

  if (!ctx.fn) ctx.fn = {};
  ctx.type = 'json';

  yield next;
});

// add custom functions
api.use(function* (next) {
  const ctx = this;

  ctx.fn.error = function (status, message, extra) {
    ctx.status = status;

    let body = {};
    if (message)
      body.message = message;
    if (extra)
      Object.assign(body, extra);

    ctx.body = body;
  };

  yield next;
});

// add api
fs
  .readdirSync(__dirname)
  .filter(item => fs.statSync(path.resolve(__dirname, item)).isFile() && item.slice(-3) === '.js' && item != 'index.js')
  .forEach(file => require(`./${file}`)(api));

module.exports = api;
