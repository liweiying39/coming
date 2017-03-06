"use strict";

class ConfigValue {
  constructor (env) {
    this.env = env;
    // this.protocol = 'http';
    this.protocol = 'https';
    this.server_ip = '123.207.108.254';
    this.site = 'dm.chatek.co';
    // this.site = 'dropmeet.us';
  }

  get oauth_address () {
    // return `${this.protocol}://oauth.${this.site}/${this.env === 'development' ? '?tg=dev' : ''}`;
    return `${this.host_address}/wechat/oauth`;
  }

  get host_address () {
    return `${this.protocol}://${(this.env === 'development' ? 'dev.' : '')}${this.site}`;
  }

  // get socket_address () {
  //   return `${this.protocol}://${this.server_ip}:${(this.env === 'development' ? '8000' : '8080')}/`;
  // }

}

const frontend_config = new ConfigValue(process.env.NODE_ENV);
module.exports = frontend_config;
