'use strict';

const co = require('co');
const colors = require('colors');

const behaviour = require('./behaviour.js');

class Client {

  constructor (socket, dispatcher) {
    this.socket = socket;
    this.dispatcher = dispatcher;
    this.user = null;
    this.is_connected = false;
  }

  ready () {
    const self = this;
    self.emit('ready_done', { done: true });
    self.on('connection', behaviour.ready);
    self.on('disconnect', behaviour.disconnect);
  }

  on (type, generator) {
    const self = this;
    self.socket.on(type, (...args) => {
      let from_name = this.user ? this.user.name : 'new client';
      console.log(colors.blue(`${new Date} [from ${from_name}] ${type} : ${JSON.stringify(args)}`));
      co(generator.call(self, ...args))
        .then(() => true)
        .catch((err) => {
          console.log(colors.red(`co running error ${err}`))
        });
    })
  }

  emit (type, ...messages) {
    let from_name = this.user ? this.user.name : 'new client';
    console.log(colors.blue(`${new Date} [to ${from_name}] ${type} : ${JSON.stringify(messages)}`));
    messages.map((msg) => msg.type = type);
    this.socket.emit('coming', ...messages);
  }

  // broadcast (type, ...messages) {
  //   console.log(colors.blue(`[to broadcast ${this.user.name}] ${type} : ${JSON.stringify(messages)}`));
  //   this.event.broadcast(type, ...messages);
  // }

  getSocketId () {
    return this.socket.id;
  }

}


module.exports = Client;
