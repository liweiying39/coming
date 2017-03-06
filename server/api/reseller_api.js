'use strict';

const db = require('../../core').getService('db');
const checkToken = require('../utils/auth.js').checkToken;

function init (api) {

  api
    .use('/reseller', checkToken)

    .use('/reseller', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;

      if (!current_user.checkRole('reseller'))
        return ctx.fn.error(403, `current user's role is not reseller`);

      let reseller_info = yield current_user.getResellerInfo();
      if (!reseller_info)
        reseller_info = yield db.ResellerInfo.create({ reseller_id: current_user.id, });

      current_user.reseller_info = reseller_info;

      yield next;
    })

    .get('/reseller', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;

      let sold = yield db.EventCode.count({ where: { reseller_id: current_user.id } });
      let used = yield db.EventCode.count({ where: { reseller_id: current_user.id, is_used: true } });

      return ctx.body = {
        current_user: yield* current_user.getData({
          business: {
            status: current_user.reseller_info.status,
            sold: sold,
            used: used,
            inventory: current_user.reseller_info.inventory
          }
        }),
      }
    })

    .put('/reseller/inventory', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;

      if (!current_user.reseller_info.isValid())
        return ctx.fn.error(403, 'current user is not a valid reseller');
      if (current_user.reseller_info.inventory <= 0)
        return ctx.fn.error(404, 'current user does not have inventory');

      let event_code = yield* db.EventCode.generate({ reseller_id: current_user.id });
      if (event_code) {
        let new_inventory = current_user.reseller_info.inventory - 1;
        yield current_user.reseller_info.update({ inventory: new_inventory });
      } else
        return ctx.fn.error(500, 'database error');

      return ctx.body = {
        event_code: yield* event_code.getData()
      }
    });

  return true;
}

module.exports = init;
