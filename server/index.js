'use strict';

const fs = require('fs');
const path = require('path');
const colors = require('colors/safe');
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const mount = require('koa-mount');
const router = require('koa-router');
const session = require('koa-generic-session');
const RedisSession = require('koa-redis');

const app = new koa();
app.proxy = true;


let https_option = {
  cert: fs.readFileSync(path.resolve('ssl', 'certificate.crt')),
  key: fs.readFileSync(path.resolve('ssl', 'privatekey.key'))
};
// const server = require('http').createServer(app.callback());
const server = require('https').createServer(https_option, app.callback());
const config = require('../config/index.js');
const cache = require('./utils/cache.js');

// // socket.io
// const socket_io = require('./socket');
// socket_io.init(server);

// bodyparser
app.use(bodyParser());

// koa-generic-session by koa-redis
app.keys = ['comming'];
app.use(session({
  store: RedisSession()
}));

// koa-log4
const log4js = require('koa-log4');
app.use(log4js.koaLogger(log4js.getLogger('http'), { level: 'auto' }));

// // koa-logs-full
// const LogRecord = require('koa-logs-full');
// app.use(LogRecord(app, {
//   logdir: path.join(__dirname, 'logs'),
//   env: config.__environment__
// }));

// koa-logger
// const logger = require('koa-logger');
// app.use(logger());

// static file, such as .js and .css
const serve = require('koa-static');
app.use(serve(__dirname + '/static'));

// koa-ejs for rendering admin page
// const render = require('koa-ejs');
// render(app, {
//   root: path.join(__dirname, 'admin', 'views'),
//   layout: 'template',
//   viewExt: 'html',
//   cache: false,
//   debug: true
// });
// const admin = require('./admin');
// app.use(mount('/admin', admin.middleware()));

// api part
const api = require('./api');
app.use(mount('/api', api.middleware()));

/**
 * 2017-1-9
 * 配置有dev.测试用域名时，公众号oauth回调域名只能配置一个
 * 所以需要单独配置一个oauth.的域名用来作为oauth回调获取code再进行分发
 * 现需要配置https，所以取消oauth.这个域名，恢复/wechat/oauth进行验证
 *
// if environment is production
// create a /oauth route for wechat authorization
// by visit 'oauth.coming.chatek.co'
if (config.__environment__ === 'production') {
  const wechat_oauth = require('./wechat/wechat_oauth.js');
  const querystring = require('querystring');

  app.use(mount('/oauth', function* (next) {
    const ctx = this;

    let target = ctx.request.query.tg || 'prod';

    if (!ctx.request.query.code && !ctx.request.query.state) {
      let share = ctx.request.query.share || 0;
      let auth_url = wechat_oauth.getAuthorizeURL(config.oauth_address, share, 'snsapi_userinfo');
      return ctx.redirect(auth_url);

    } else if (ctx.request.query.code) {

      return ctx.redirect(`${config.allow_oauth_hosts[target]}?${querystring.stringify({
        code: ctx.request.query.code,
        state: ctx.request.query.state
      })}`)

    } else
      return ctx.status = 503;
  }));
} */

// wechat auth and api part
const wechat = require('./wechat');
app.use(mount('/wechat', wechat.middleware()));

// front-end
app.use(require('../client'));

const _port = process.env.PORT || config.port;
server.listen(_port, function (err) {
  if (err)
    throw err;
  console.log(colors.green('environment is', config.__environment__));
  console.log(colors.green('debug is', config.debug));
  console.log(colors.green('Server Listen at', config.port));
});

/**
 * if (config.debug)
 * app.use(require('kcors')())
 * const Resource = require('library/resource')
 * const users = new Resource('users')
 * users.get('/', function *() {
 *  this.body = 'this is user'
 * })
 * app
 * .use(users.routes())
 * .use(users.allowedMethods())
 * console.log(users)
 * var router = require('koa-router')();
 * router.get('/', function *(next) {this.body = 'Hello World!'});
 * app
 * .use(router.routes())
 * .use(router.allowedMethods());
 */
