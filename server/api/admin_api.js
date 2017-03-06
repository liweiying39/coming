'use strict';

const db = require('../../core').getService('db');
const checkToken = require('../utils/auth.js').checkToken;

const sms = require('../../core').getService('sms');

function init (api) {

  api
    .use('/admin', checkToken)

    .use('/admin', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;

      if (!current_user.checkRole('admin'))
        return ctx.fn.error(403, 'current user is not admin');

      yield next;
    })

    .get('/admin/business', function* (next) {
      const ctx = this;

      let sold = yield db.EventCode.count();
      let used = yield db.EventCode.count({ where: { is_used: true } });
      let inventory = yield db.ResellerInfo.sum('inventory');

      return ctx.body = {
        business: {
          sold: sold || 0,
          used: used || 0,
          inventory: inventory || 0
        }
      };
    });

    // .get('/sms', function* (next) {
    //   const ctx = this;
    //
    //   sms.single.to(15088132432).content(7978, [120505]).send()
    //     .then((res) => console.log(res))
    //     .catch((err) => console.log(err));
    //
    //   return ctx.body = {
    //     success: true
    //   }
    // });

  return true;
}

module.exports = init;
