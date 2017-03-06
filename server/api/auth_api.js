'use strict';

const colors = require('colors');

const core = require('../../core');
const db = core.getService('db');
const jwt = core.getService('jwt');

const wechat_api = require('../wechat/wechat_api.js');
const config = require('../../config');

const checkToken = require('../utils/auth.js').checkToken;

function init (api) {

  api
    .get('/token', function* (next) {
      const ctx = this;

      let token;
      let openid = ctx.session.wechat_openid || null;

      if (openid) {
        let user = yield db.User.findOne({ where: { wechat_openid: openid } });
        if (user)
          token = user.generateToken();
        else
          return ctx.fn.error(422, 'invalid openid')
      } else {
        return ctx.fn.error(403);
      }

      // delete ctx.session.wechat_openid;
      return ctx.body = { token: token };
    })

    .get('/jsapi', checkToken, function* (next) {
      const ctx = this;
      const url = ctx.request.query.url;
      if (!url)
        return ctx.fn.error(422);

      console.log(colors.green(url));

      let ticket = JSON.parse(yield* db.Config.read('jsapi'));
      if (!ticket || Date.now() > ticket.expireTime)
        ticket = yield* wechat_api.getTicket();

      let params = {
        debug: false,
        jsApiList: JSON.parse(ctx.request.query.sdk) || [],
        url: url
      };
      let result = yield* wechat_api.getJsConfig(params);

      return ctx.body = { config: result };
    });

  return true;
}

module.exports = init;
