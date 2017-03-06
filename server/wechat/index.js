'use strict';

const fs = require('fs');
const path = require('path');

const wechat = require('koa-router')();

const config = require('../../config');
const db = require('../../core').getService('db');
const wechat_api = require('./wechat_api.js');

const routes = require('./routes.js');

wechat
  .get('/test', routes.test)
  // .get('/auth', routes.auth)
  .get('/oauth', routes.oauth);


module.exports = wechat;
