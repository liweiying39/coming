'use strict';

const nodemailer = require('nodemailer');

class Mailer {
  constructor () {
    this.transporter = null;
  }

  init (config) {
    this.user = config.user;
    this.transporter = nodemailer.createTransport({
      host: 'smtp.exmail.qq.com',
      port: 465,
      secureConnection: true,
      auth: {
        user: config.user,
        pass: config.pass
      }
    });
    return this;
  }

  send (mailoptions) {
    return new Promise((resolve, reject) => {
      if (!mailoptions.from)
        mailoptions.from = this.user;

      this.transporter.sendMail(mailoptions, function (err, info) {
        if (err)
          return reject(err);
        return resolve(info);
      });
    });
  }
}

const mailer = new Mailer();

module.exports = mailer;
