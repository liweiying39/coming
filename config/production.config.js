/**
 * Created by brambles on 16/9/26.
 */

'use strict';

const BaseConfig = require('./base.config');

class ProductionConfig extends BaseConfig{
  constructor(){
    super();
    this.debug = true;
    this.datebase = require('./database.json')['production'];
  }
}

module.exports = ProductionConfig;
