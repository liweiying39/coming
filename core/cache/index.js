'use strict';

const colors = require('colors');
const redis = require('redis');
const bluebird = require('bluebird');

const config = require('../../config');
const types = require('./types');

bluebird.promisifyAll(redis);

class Cache {
  constructor (err_callback) {
    this.prefix = config.redis_key_prefix;
    this.client = redis.createClient();
    this.client.on('error', err_callback || function (err) {
        console.log(`Error: ${err}`.red);
      });
  }

  getClient () {
    if (!this.client)
      throw new Error('createClient failed');
    return this.client;
  }

  hash (name) {
    return new types.Hash(this, name);
  }

  list (...names) {
    return new types.List(this, ...names);
  }

  get (name) {
    return this.client.getAsync(`${this.prefix}:${name}`);
  }

  set (name, value) {
    return this.client.setAsync(`${this.prefix}:${name}`, value);
  }

  subscribe (channel, callback) {
    this.client.on('message', function (channel, message) {
      console.log(`[SUBSCRIBE] ${message}`);
      try {
        callback(JSON.parse(message));
      } catch (err) {
        callback(message);
      }
    });
    this.client.subscribe(`${this.prefix}.${channel}`);
  }

  publish (channel, message) {
    if (typeof message != 'string')
      message = JSON.stringify(message);
    return this.client.publish(`${this.prefix}.${channel}`, message);
  }
}

module.exports = Cache;
