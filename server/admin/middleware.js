'use strict';

const db = require('../../core').getService('db');

const middleware = {};

middleware.getUserByQuery = function* (next) {
  const ctx = this;

  let user_id = ctx.request.query.user_id;
  if (!user_id)
    return ctx.state
      .flash({message: '没有相应的用户', type: 'red'})
      .redirect(ctx.state.gurl('index'));

  let user = yield db.User.findById(user_id);
  if (!user)
    return ctx.state
      .flash({message: '没有相应的用户', type: 'red'})
      .redirect(ctx.state.gurl('index'));

  ctx.target_user = user;
  yield next;
};

module.exports = middleware;
