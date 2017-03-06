'use strict';

const querystring = require('querystring');

class SingleSmsSender {
  constructor (sms_service) {
    this.service = sms_service;
    this.uri = 'https://yun.tim.qq.com/v5/tlssmssvr/sendsms';
    this.init();
  }

  /**
   * 指定短信送达的手机号码
   *
   * 参数可以是::
   * 包含nationcode、mobile属性的对象、
   * 字符串（'86-123123123' 或 '123123123'）、
   * 数字
   *
   * @param number_data {string|object|number}
   * @returns {SingleSmsSender}
   */
  to (number_data) {
    const sender_data = this.sender_data;
    if (typeof number_data == 'object') {

      sender_data.nationcode = number_data.nationcode || '86';
      sender_data.mobile = number_data.mobile || null;
      return this;

    } else if (typeof number_data == 'string') {

      let regr_match = number_data.match(/^(\d+)-(\d+)$/);
      if (regr_match) {
        sender_data.nationcode = regr_match[1];
        sender_data.mobile = regr_match[2];
        return this;
      }

    }
    sender_data.nationcode = '86';
    sender_data.mobile = (number_data).toString();
    return this;
  }

  /**
   * 指定发送短信所使用的签名
   * 参数内容不用包含中文方括号
   *
   * 如果调用了此方法，并且content发送方式为不使用模板发送，则参数无需包含签名部分
   *
   * Example::
   *   // 【Sign】content
   *   .sign('Sign')
   *   .content('content')
   *
   * @param sign_text
   * @returns {SingleSmsSender}
   */
  sign (sign_text) {
    this.sender_data.sign = sign_text;
    return this;
  }

  /**
   * 指定发送的短信内容
   * 支持直接发送内容和按模板发送两种方式
   *
   * Example::
   *   // 直接发送
   *   .content('你好用户')
   *   // 按模板发送
   *   .content(1, ['123', '123'])
   *
   * @param content_or_tpl_id {string|number}
   * @param params {Array}
   * @returns {SingleSmsSender}
   */
  content (content_or_tpl_id, params) {
    const sender_data = this.sender_data;

    if (typeof content_or_tpl_id == 'number' && params) {

      if (!Array.isArray(params))
        throw new TypeError(`Method content() parameter 2 need to be array type`);
      sender_data.tpl_id = content_or_tpl_id;
      sender_data.params = params.map(function (p) {
        return p.toString();
      });
    } else {
      sender_data.content = content_or_tpl_id;
    }
    return this;
  }

  send () {
    const self = this;
    const service = self.service;

    return new Promise(function (resolve, reject) {
      let random = service.util.random();
      let url = `${self.uri}?${querystring.stringify({ sdkappid: service.getAppid(), random: random })}`;
      let timestamp = service.util.now();
      let signature = service.util.signature(service.getAppkey(), random, timestamp, self.sender_data.mobile);

      let request_body = {
        tel: { nationcode: self.sender_data.nationcode, mobile: self.sender_data.mobile },
        type: 0, sig: signature, time: timestamp, extend: '', ext: ''
      };

      if (self.sender_data.tpl_id) {
        if (self.sender_data.sign)
          request_body.sign = self.sender_data.sign;
        request_body.tpl_id = self.sender_data.tpl_id;
        request_body.params = self.sender_data.params;
      } else {
        if (self.sender_data.sign)
          self.sender_data.content = `【${self.sender_data.sign}】${self.sender_data.content}`;
        request_body.msg = self.sender_data.content;
      }

      service.util.postRequest({ url: url, body: request_body }, function (err, response) {
        if (err) return reject(err);
        resolve(response);
      });
    });
  }

  init () {
    delete this.sender_data;
    this.sender_data = {
      tpl_id: null,
      sign: null,
      nationcode: null,
      mobile: null,
      content: null,
      params: null
    };
    return this;
  }
}

module.exports = SingleSmsSender;
