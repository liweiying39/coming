/**
 * Created by brambles on 16/9/26.
 */

'use strict';

const fs = require('fs');
const colors = require('colors/safe');
const default_environment = 'development';

let environment = process.env.NODE_ENV;

const environment_list =
  fs.readdirSync(__dirname)
    .filter(item => /\.config\.js$/.test(item))
    .map(item => item.replace(/\.config\.js$/, ''));

if (environment_list.indexOf(environment) < 0) {
  if (!environment) {
    environment = default_environment;
    process.env.NODE_ENV = environment;
    console.log(colors.yellow.underline(`Warning: NODE_ENV not set, using "${environment}"`))
  }
  else
    throw new Error('Cannot found config: ' + environment)
}

const Config = require(`./${environment}.config.js`);
const config = new Config();
config.__environment__ = environment;
module.exports = config;
