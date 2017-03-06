'use strict';

const db = require('../../core').getService('db');
const middlewares = require('./middleware.js');

const routes = {};

routes.index = {
  method: 'get',
  url: '/',
  generator: function* (next) {
    const ctx = this;

    yield ctx.render('index', {
      title: '首页'
    });
  }
};

routes.users = {
  method: 'get',
  url: '/users',
  generator: function* (next) {
    const ctx = this;

    let users = yield db.User.findAll();

    yield ctx.render('users', {
      title: '用户列表',
      users: users
    });
  }
};

routes.edit_user = {
  method: 'get',
  url: '/edit_user',
  middlewares: middlewares.getUserByQuery,
  generator: function* (next) {
    const ctx = this;

    yield ctx.render('edit_user', {
      title: '编辑用户',
      user: ctx.target_user
    });
  }
};

routes.edit_user_handle = {
  method: 'post',
  url: '/edit_user_handle',
  middlewares: middlewares.getUserByQuery,
  generator: function* (next) {
    const ctx = this;

    yield ctx.target_user.update(ctx.request.body);

    return ctx.state
      .flash({ message: '修改成功', type: 'green' })
      .redirect(ctx.state.gurl('edit_user', { user_id: ctx.target_user.id }))
  }
};

module.exports = routes;
