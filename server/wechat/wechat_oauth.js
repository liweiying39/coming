'use strict';

const config = require('../../config');
const cache = require('../utils/cache.js');

const OAuth = require('wechat-oauth');
const wechat_oauth = new OAuth(
  config.app_id, 
  config.app_secret,
  function (openid, callback) {
	cache.get('oauth_token:' + openid)
	  .then((token) => { callback(null, JSON.parse(token)) })
	  .catch((err) => { callback(err); console.error(err); });
  },
  function (openid, token, callback) {
	cache.set('oauth_token:' + openid, JSON.stringify(token))
	  .then(() => { callback() })
	  .catch((err) => { console.error(err); })
  }
);

module.exports = wechat_oauth;
