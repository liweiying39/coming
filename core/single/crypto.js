"use strict";

const cryptolib = require('crypto');

const _crypto = {
  support_list: ['md5', 'sha256']
};

const crypto = new Proxy(_crypto, {
  get: function (source, key) {
    let source_attr = Reflect.get(source, key);
    if (source_attr) return source_attr;

    if (Reflect.get(source, 'support_list').indexOf(key) < 0)
      return undefined;

    return {
      hash: function (content, digest = 'hex') {
        return cryptolib.createHash(key).update(content).digest(digest);
      }
    };
  }
});

module.exports = crypto;
