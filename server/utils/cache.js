'use strict';

const initCacher = require('sequelize-redis-cache');

const core = require('../../core');
const db = core.getService('db');
const Cache = core.getService('cache');

const cache = new Cache();

const db_cacher = {
  cacher: initCacher(db.sequelize, cache.getClient()),
  default_ttl: 15,
  cache_list: {}
};

cache.db = new Proxy(db_cacher, {
  get: function (target, prop) {
    if (!target.cache_list[prop])
      target.cache_list[prop] = target.cacher(prop).ttl(target.default_ttl);

    return target.cache_list[prop];
  }
});

module.exports = cache;
