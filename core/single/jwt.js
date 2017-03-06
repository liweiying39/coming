'use strict';

class JWT {

  constructor () {
    this._secret = 'comming';
    this._jwt = require('jsonwebtoken');
  }

  generate (data, expire = 86400) {
    return this._jwt.sign(data, this._secret, { expiresIn: parseInt(expire) })
  }

  verify (token, handle) {
    let error = null;
    let data;
    try {
      data = this._jwt.verify(token, this._secret);
    } catch (err) {
      error = err;
    }
    return handle(error, data);
  }

}

const jwt = new JWT();

module.exports = jwt;
