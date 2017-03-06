'use strict';

const wechat = require('./index.js');
const config = require('../../config');
const db = require('../../core').getService('db');
const wechat_oauth = require('./wechat_oauth');
const wechat_api = require('./wechat_api');
const colors = require('colors');
const querystring = require('querystring');

module.exports.test = function* (next) {
  const ctx = this;
  if (config.__environment__ === 'development') {
    let openid = ctx.request.query.openid || null;
    let count = yield db.User.count();
    let user;

    if (openid) {
      user = yield db.User.findOne({ where: { wechat_openid: openid } });
      if (!user) {
        user = yield db.User.create({
          name: 'client' + count,
          wechat_openid: openid
        })
      }
    }
    else
      user = yield db.User.findOne();

    ctx.session.wechat_openid = user.wechat_openid;
    return ctx.redirect('/');
  } else {
    return ctx.status = 404;
  }
};

module.exports.auth = function* (next) {
  const ctx = this;

  if (!ctx.request.query.code && !ctx.request.query.state) {

    // let auth_url = wechat_oauth.getAuthorizeURL(ctx.request.href, '', 'snsapi_userinfo');
    // return ctx.redirect(auth_url);
    let query = '';
    if (config.__environment__ === 'development')
      query = `?${querystring.stringify({ tg: 'dev' })}`;

    return ctx.redirect(config.oauth_address + query);

  } else if (ctx.request.query.code) {
    let result = yield new Promise((resolve, reject) => {
      wechat_oauth.getAccessToken(ctx.request.query.code, function (err, result) {
        if (err) {
          console.log(colors.red(err));
          // throw reject(err);
          return ctx.status = 500;
        }
        return resolve(result);
      });
    });

    let access_token = result.data.access_token;
    let openid = result.data.openid;

    let user = yield db.User.findOne({ where: { wechat_openid: openid } });
    // use oauth get user data not by wechat api!!
    // let user_data = yield* wechat_api.getUser({ openid: openid, lang: 'zh_CN' });
    let user_data = yield new Promise((resolve, reject) => {
      wechat_oauth.getUser({ openid: openid, lang: 'zh_CN' }, function (err, data) {
        if (err) return reject(err);
        return resolve(data);
      })
    });
    let avatar = user_data.headimgurl.slice(0, -1) + '132';
    if (!user) {
      yield db.User.create({
        name: user_data.nickname,
        avatar: avatar,
        wechat_openid: user_data.openid,
        free_event_count: 0
      });
    } else {
      if (user.avatar != avatar)
        yield user.update({
          avatar: avatar
        });
    }

    ctx.session.wechat_openid = openid;
    let url = '/#!/';
    let params = {};
    // url += '?share=' + ctx.request.query.state;
    if (ctx.request.query.state && ctx.request.query.state != '0')
      params.share = ctx.request.query.state;
    let lang = ctx.headers['user-agent'].match(/Language\/([a-zA-Z_]+)/);
    if (lang && !params.share)
      params.lang = lang[1];
    return ctx.redirect(url + '?' + querystring.stringify(params));
  }
  else
    return ctx.status = 503;
};

module.exports.oauth = function* (next) {
  const ctx = this;

  if (!ctx.request.query.code && !ctx.request.query.state) {
    let share = ctx.request.query.share || 0;
    let auth_url = wechat_oauth.getAuthorizeURL(config.oauth_address, share, 'snsapi_userinfo');
    return ctx.redirect(auth_url);

  } else if (ctx.request.query.code) {

    let result = yield new Promise((resolve, reject) => {
      wechat_oauth.getAccessToken(ctx.request.query.code, function (err, result) {
        if (err) {
          console.log(colors.red(err));
          // throw reject(err);
          return ctx.status = 500;
        }
        return resolve(result);
      });
    });

    let access_token = result.data.access_token;
    let openid = result.data.openid;

    let user = yield db.User.findOne({ where: { wechat_openid: openid } });
    // use oauth get user data not by wechat api!!
    // let user_data = yield* wechat_api.getUser({ openid: openid, lang: 'zh_CN' });
    let user_data = yield new Promise((resolve, reject) => {
      wechat_oauth.getUser({ openid: openid, lang: 'zh_CN' }, function (err, data) {
        if (err) return reject(err);
        return resolve(data);
      })
    });
    let avatar = user_data.headimgurl.slice(0, -1) + '132';
    if (!user) {
      yield db.User.create({
        name: user_data.nickname,
        avatar: avatar,
        wechat_openid: user_data.openid,
        free_event_count: 0
      });
    } else {
      if (user.avatar != avatar)
        yield user.update({
          avatar: avatar
        });
    }

    ctx.session.wechat_openid = openid;
    let url = '/#!/';
    let params = {};
    // url += '?share=' + ctx.request.query.state;
    if (ctx.request.query.state && ctx.request.query.state != '0')
      params.share = ctx.request.query.state;
    let lang = ctx.headers['user-agent'].match(/Language\/([a-zA-Z_]+)/);
    if (lang && !params.share)
      params.lang = lang[1];
    return ctx.redirect(url + '?' + querystring.stringify(params));

  } else
    return ctx.status = 503;
};
