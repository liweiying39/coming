"use strict";

const path = require('path');
const koastatic = require('koa-static');
const config = require('../config/index');


if (config.__environment__ === 'development') {
  const app = require('./build/dev-server');
  module.exports = function* (next) {
    if (this.status === 404 || this.status === '404') {
      delete this.res.statusCode
    }
    // stop koa future processing (NOTE not sure it is un-doc feature or not?)
    this.respond = false;
    // pass req and res to express
    app(this.req, this.res)
  }
} else {
  module.exports = koastatic(require('./config/index').build.assetsRoot)
}
