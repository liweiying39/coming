'use strict';

const SMSUntil = require('./SMSUntil.js');
const SingleSmsSender = require('./SingleSmsSender.js');

class QCloudSMS {
  /**
   * 腾讯云短信服务
   *
   * Example::
   *    const qcloud_service = new QCloudSMS({
   *      appid: 'appid',
   *      appkey: 'appkey'
   *    });
   *    qcloud_service.single
   *      .to(123123123).content(1234, ['param1']).send()
   *      .then(callback).catch(callback);
   *
   * @param options appid string or an object with appid attribute
   * @author PineappleBen
   * @version 1.0.0
   */
  constructor (options) {
    this.options = options;

    if (typeof options != 'object')
      throw new Error('QCloudSMS receive an object type parameter');
    else if (!options.appid || !options.appkey)
      throw new Error('QCloudSMS require your sdk app id');

    this.util = SMSUntil;
    this.single = new SingleSmsSender(this);
  }

  getAppid () {
    return this.options.appid;
  }

  getAppkey () {
    return this.options.appkey;
  }
}

module.exports = QCloudSMS;
