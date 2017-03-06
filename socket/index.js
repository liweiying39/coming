"use strict";

const fs = require('fs');
const path = require('path');

const Socket = require('socket.io');
const RedisAdapter = require('socket.io-redis');

// const server = require('http').createServer();
let https_option = {
  cert: fs.readFileSync(path.resolve('ssl', 'certificate.crt')),
  key: fs.readFileSync(path.resolve('ssl', 'privatekey.key'))
};
const server = require('https').createServer(https_option);

const dispatcher = require('./dispatcher.js');
const config = require('../config');
const Cache = require('../core').getService('cache');

// const dispathcerBind = require('./tools.js').dispatcherBind;

class ISocketIO {
  constructor () {
    this.server = null;
    this.io = null;
    this.dispatcher = dispatcher;
  }

  init (server) {
    const self = this;
    self.server = server;
    self.io = Socket(self.server);
    self.io.adapter(RedisAdapter({
      host: 'localhost',
      port: 6379
    }));

    self.dispatcher.init(this);
    // Object.keys(dispathcerBind).forEach((fn) => {
    //   self.dispatcher.bind(fn, dispathcerBind[fn]);
    // });
    const sub = new Cache();
    sub.subscribe(config.message_channel, function (msg) {
      if (!msg.user_id || !msg.content)
        return;
      let user_id = msg.user_id;
      let content = msg.content;
      self.dispatcher.getClient(user_id)
        .then((client) => {
          client.emit(content.type, content.body);
        })
    });
  }
}

const socket_io = new ISocketIO();

socket_io.init(server);

server.listen(process.env.PORT || config.sio_port);

// module.exports = socket_io;
