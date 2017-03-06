/**
 * Created by brambles on 16/9/26.
 */
'use strict';

class BaseConfig {
  constructor () {
    this.port = 7001;
    this.sio_port = 9001;
    this.debug = false;
    this.version = require('../package.json')['version'];

    // chatek
    this.app_id = 'wxc135ac7ef80f2513';
    this.app_secret = 'f2eed235a4dafd91b379674856d24d95';
    // test
    // this.app_id = 'wxd8ac8769e43dda5b';
    // this.app_secret = 'f70bac59d4a48de1b8014e93fc04e1b3';

    // ?
    this.token = '3786ff8f2dc44bc8b99b6d2885de18df';

    this.token_expire_in = 86400;

    this.redis_key_prefix = 'coming';
    this.message_channel = 'messages';

    this.host_name = 'dm.chatek.co';
    // this.host_name = 'dropmeet.us';
    // this.protocol = 'http';
    this.protocol = 'https';

    this.oauth_address = `${this.protocol}://dm.chatek.co/wechat/oauth`;
    // this.oauth_address = `${this.protocol}://oauth.dropmeet.us`;

    this.allow_oauth_hosts = {
      prod: `${this.protocol}://dm.chatek.co/wechat/auth`,
      dev: `${this.protocol}://dev.dm.chatek.co/wechat/auth`,
      // prod: `${this.protocol}://dropmeet.us/wechat/auth`,
      // dev: `${this.protocol}://dev.dropmeet.us/wechat/auth`,
    };

    // qcloud sms
    this.sms_appid = '1400022230';
    this.sms_appkey = '38d0c5c7a467768868e802c7e1cd3cf2';
    this.sms_template_id = 7978;

    // email
    this.email_user = 'dropmeet@chatek.co';
    this.email_pass = 'Dr0p@123';

    this.event_state_path = 'generate';
  }

  getSiteUrl () {
    return `${this.protocol}://${this.host_name}`;
  }
}

module.exports = BaseConfig;
