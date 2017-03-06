/**
 * Created by brambles on 16/9/26.
 */

'use strict'

const BaseConfig = require('./base.config')

class TestConfig extends BaseConfig{
  constructor(){
    this.debug = false
    this.datebase = require('./database.json')['test']
  }
}

module.exports = TestConfig
