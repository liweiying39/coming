'use strict';

const path = require('path');
const fs = require('fs');

const config = require('../../config');
const db = require('../../core').getService('db');
const cache = require('../utils/cache.js');

const WechatApi = require('co-wechat-api');

const file_name = path.resolve(__dirname, 'access_token.txt');

const wechat_api = new WechatApi(
  config.app_id, config.app_secret,
  function* () {
    // let data = yield* db.Config.read('access_token');
    let data = yield cache.get('wechat:access_token');
    return JSON.parse(data);
  },
  function* (token) {
    // yield* db.Config.write('access_token', JSON.stringify(token));
    yield cache.set('wechat:access_token', JSON.stringify(token));
  });

wechat_api.registerTicketHandle(
  function* (type) {
    type = type || 'jsapi';
    let ticket = yield* db.Config.read(type);
    return JSON.parse(ticket);
  },
  function* (type, ticket_token) {
    type = type || 'jsapi';
    yield* db.Config.write(type, JSON.stringify(ticket_token));
  });

// const wechat_api = new WechatApi(config.app_id, config.app_secret);

module.exports = wechat_api;
