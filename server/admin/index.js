'use strict';

const admin_router = require('koa-router')();
const routes = require('./routes.js');

const querystring = require('querystring');

const router_map = {};
const generateUrl = function (key, query) {
  if (!(key in router_map))
    throw new Error('route name not found');

  let url = '/admin' + router_map[key];

  if (query)
    url += `?${querystring.stringify(query)}`;
  return url;
};

const alert_map = {
  red: 'danger',
  green: 'success',
  blue: 'info',
  yellow: 'warning'
};

admin_router
  .use(function* (next) {
    const ctx = this;
    ctx.state = ctx.state || {};

    ctx.state.gurl = generateUrl;

    ctx.state.flash = function ({ message, type }) {
      if (!type || !alert_map[type])
        type = 'info';
      else
        type = alert_map[type];
      ctx.session.flash_store = ctx.session.flash_store || [];
      ctx.session.flash_store.push({ message, type });
      return ctx;
    };

    ctx.state.getFlash = function () {
      let result = ctx.session.flash_store || [];
      ctx.session.flash_store = [];
      return result;
    };

    yield next;
  });

Object.keys(routes).forEach((name) => {
  let route = routes[name];

  router_map[name] = route.url;
  let method = route.method;

  let mw = [route.generator];
  if (route.middlewares) {
    if (Array.isArray(route.middlewares)) {
      mw = route.middlewares;
      mw.push(route.generator);
    }
    else
      mw.unshift(route.middlewares);
  }

  admin_router[method](route.url, ...mw);
});


module.exports = admin_router;
