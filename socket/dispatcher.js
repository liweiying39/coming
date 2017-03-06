const colors = require('colors');

const Client = require('./client/index');
const emitter = require('./emitter.js');

const Cache = require('../core').getService('cache');

class Dispatcher {
  constructor () {
    this.io = null;
    this.namespace = null;
    this.room_manager = null;
    this.cache = new Cache();
    this.emitter = emitter;
    this.client_map = {};
  }

  init (socket_io) {
    this.io = socket_io.io;
    this.namespace = this.io.sockets;
    this.emitter.init(this);

    this.io.on('connection', (socket) => {
      console.log(colors.yellow(`${new Date()} connecting...`));
      let client = new Client(socket, this);
      client.ready();
    });
  }

  bind (fn_name, fn) {
    if (typeof fn != 'function')
      throw new Error(`bind parameter 2 receive function type`);
    if (this[fn_name])
      throw new Error(`dispather instance has '${fn_name}' attribute already`);

    this[fn_name] = fn.bind(this);
  }

  registerClient (user_id, client) {
    this.cache
      .hash('socket').set(user_id, client.getSocketId())
      .then((v) => {
        this.client_map[user_id] = client;
      });
  };

  deregisterClient (user_id) {
    this.cache
      .hash('socket').del(user_id)
      .then((v) => {
        if (this.client_map[user_id])
          delete this.client_map[user_id];
      })
  };

  // return a Promise
  getClient (user_id) {
    return new Promise((resolve, reject) => {
      try {
        let result = null;
        if (this.client_map[user_id]) {
          let socket_id = this.client_map[user_id].getSocketId();

          if (!this.namespace.connected[socket_id])
            this.deregisterClient(user_id);
          else
            result = this.client_map[user_id];
        }

        return resolve(result);
      } catch (err) {
        return reject(err);
      }
    });
  };

}

let dispatcher = new Dispatcher();
module.exports = dispatcher;
