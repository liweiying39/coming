'use strict';

const urllib = require('url');
const querystring = require('querystring');
const crypto = require('crypto');

const SMSUntil = {};

SMSUntil.random = function () {
  return (Math.random()).toString().slice(2);
};

SMSUntil.signature = function (appkey, random, timestamp, mobile) {
  let sig_data = { appkey: appkey, random: random, time: timestamp, mobile: mobile };
  return crypto
    .createHash('sha256')
    .update(querystring.stringify(sig_data))
    .digest('hex');
};

SMSUntil.now = function () {
  return Math.round(Date.now() / 1000);
};

SMSUntil.postRequest = function ({ url, body }, callback) {
  let url_parsed = urllib.parse(url);
  const protocollib = require(url_parsed.protocol.slice(0, -1) || 'http');

  // let request_body = querystring.stringify(body);
  let request_body = JSON.stringify(body);
  console.log(request_body);

  let options = {
    host: (function (host) {
      let result = host.match(/(.+):/);
      return result ? result[1] : host;
    }(url_parsed.host)),
    path: url_parsed.path,
    port: url_parsed.port || url_parsed.protocol == 'http:' ? 80 : 443,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': request_body.length
    }
  };

  let req = protocollib.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      let output = {};
      try {
        output.data = JSON.parse(chunk);
      } catch (err) {
        output.data = chunk;
      }
      output.statusCode = res.statusCode;
      output.headers = res.headers;
      callback(null, output);
    });
  });
  req.on('error', function (err) {
    callback(err, null);
  });
  req.write(request_body, 'utf8');
  req.end();
};

// let options = { url: 'http://localhost:3030/messages', body: { text: '123' } };
// SMSUntil.postRequest(options, function (err, res) {
//   if (err) return console.log(err);
//   console.log(res);
// });

module.exports = SMSUntil;
