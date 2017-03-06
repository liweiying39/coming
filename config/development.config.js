/**
 * Created by brambles on 16/9/26.
 */

'use strict';

const BaseConfig = require('./base.config');

class DevelopmentConfig extends BaseConfig{
  constructor(){
    super();
    this.port = 7000;
    this.sio_port = 9000;
    this.debug = true;
    this.datebase = require('./database.json')['development'];

    this.host_name = 'dev.coming.chatek.co';
  }
}

module.exports = DevelopmentConfig;
