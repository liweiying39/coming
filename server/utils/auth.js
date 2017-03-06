'use strict';

const core = require('../../core');
const jwt = core.getService('jwt');
const db = core.getService('db');

const cache = require('./cache.js');

module.exports.checkToken = function* checkToken (next) {
  const ctx = this;
  let is_legal = false;

  if ('authorization' in ctx.header) {
    let user_id = null;

    jwt.verify(ctx.header.authorization, (error, data) => {
      if (error) return;
      user_id = data.user_id;
    });

    if (user_id) {
      // let current_user = yield cache.db.User.findOne({ where: { id: user_id } });
      let current_user = yield cache.db.User.findOne({ where: { id: user_id } });
      if (current_user) {
        is_legal = true;

        if (cache.db.User.cacheHit)
          ctx.current_user = db.User.build(current_user, { isNewRecord: false });
        else
          ctx.current_user = current_user;

        yield next;
      }
    }
  }

  if (!is_legal) {
    // ctx.status = 401;
    // ctx.body = {
    //   error: 'invalid token'
    // };
    ctx.fn.error(401, 'invalid token');
  }
};

module.exports.checkManager = function* (next) {
  // if current_user'role is target event's manager or admin
  const ctx = this;
  if (!ctx.current_user.checkRole('admin')) {
    if (ctx.target_event.manager_id !== ctx.current_user.id)
      return ctx.fn.error(403);
  }
  yield next;
};
