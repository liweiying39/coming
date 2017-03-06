"use strict";

const colors = require('colors');

const core = require('../../core');
const jwt = core.getService('jwt');
const db = core.getService('db');

const behaviours = {};

// gen.call(client);
// so that you can call this inside
module.exports.ready = function* (message) {
  const client = this;
  const dispatcher = client.dispatcher;

  if (client.is_connected) return;

  let token = message.token;

  let user_id = null;
  jwt.verify(token, (err, data) => {
    if (err)
      return client.emit('connection_done', { done: false });
    user_id = data.user_id;
  });

  let user = yield db.User.findById(user_id);
  if (!user) return console.log(colors.red(`user not found by token ${token}`));

  client.user = user;
  dispatcher.registerClient(client.user.id, client);
  client.is_connected = true;
  client.emit('connection_done', { done: true, user_id: client.user.id });

  Object.keys(behaviours).forEach((fn) => {
    client.on(fn, behaviours[fn]);
  });
};

module.exports.disconnect = function* (message) {
  const client = this;
  if (client.user)
    client.dispatcher.deregisterClient(client.user.id);
  console.log(colors.yellow(`client disconnect`));
};
