"use strict";

const config = require('../config');
const SMSService = require('./node-qcloudsms');

const mailer = require('./single/mailer.js');
mailer.init({
  user: config.email_user,
  pass: config.email_pass
});

class Core {
  constructor () {
    this._services = {
      db: require('./models'),
      cache: require('./cache'),
      jwt: require('./single/jwt.js'),
      timer: require('./single/timer.js'),
      crypto: require('./single/crypto.js'),
      mailer: mailer,
      xlsxer: require('./single/xlsxer.js'),
      sms: new SMSService({
        appid: config.sms_appid,
        appkey: config.sms_appkey
      })
    };
  }

  addService (key, instance) {
    this._services[key] = instance;
    return this;
  }

  getService (key) {
    if (this._services[key])
      return this._services[key];
    throw new Error(`${key} service can not found`);
  }
}

const core = new Core();
module.exports = core;
