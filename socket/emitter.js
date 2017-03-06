const colors = require('colors');

class Process {
  constructor (emitter, target_type, targets) {
    this._emitter = emitter;
    this.target_type = target_type;
    this.targets = targets;
    this.content_lists = [];
    this._emitTargetNotFound = () => null;
  }

  content (type, message) {
    this.content_lists.push({
      type: type,
      message: message
    });
    return this;
  }

  emit () {
    if (this.target_type === 'client')
      return this._emitToClient();
  }

  _emitToClient () {
    const self = this;
    const dispatcher = self._emitter.dispatcher;
    if (!dispatcher)
      throw new Error('emitter does not init with a dispatcher');
    return new Promise((resolve, reject) => {
      if (this.content_lists.length) {
        self.targets.forEach((user_id) => {
          dispatcher.getClient(user_id)
            .then((client) => {
              self.content_lists.forEach((content) => {
                dispatcher.pubWriteEvent(user_id, content);

                if (client)
                  client.emit(content.type, content.message);
              });
            })
            .catch((err) => console.log(colors.red(err)));
        });
      }
      return resolve();
    });
  }
}

class Emitter {
  constructor () {
    this.dispatcher = null;
  }

  init (dispatcher) {
    this.dispatcher = dispatcher;
  }

  client (user_id_or_list) {
    const self = this;
    let list = Array.isArray(user_id_or_list) ? user_id_or_list : [user_id_or_list];
    return new Process(this, 'client', list);
  }
}

const emitter = new Emitter();
module.exports = emitter;
