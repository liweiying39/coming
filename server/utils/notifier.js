'use strict';

const config = require('../../config');

class Notifier {
  constructor () {
    this._client = require('./cache.js');
    this._channel = config.message_channel;
    this.WRITE = true;
  }

  deliverMessage (user_id_list, type, message, write_flag) {
    const self = this;

    let hash = self._client.hash('socket');
    let list = self._client.list('event_messages');

    user_id_list.forEach((user_id) => {
      hash.get(user_id)
        .then((sid) => {
          if (sid)
            self._client.publish(self._channel, {
              user_id: user_id,
              content: { type: type, body: message }
            });
          if (write_flag && message.event_id)
            list.rpush({
              target_user_id: user_id,
              event_id: message.event_id,
              content: message,
              is_read: Boolean(sid).toString()
            })
        })
    });
    // this._client
    //   .hash('socket').mget(...user_id_list)
    //   .then((ids) => {
    //     for (let i = 0; i < user_id_list.length; i++) {
    //       if (ids[i])
    //         this._client.publish(this._channel, {
    //           user_id: user_id_list[i],
    //           content: { type: type, body: message }
    //         });
    //       if (write_flag) {
    //         this._client.list('event_messages')
    //           .rpush({
    //             user_id: user_id_list[i],
    //             event_id: message.event_id,
    //             content: message
    //           })
    //       }
    //     }
    //   });
  }
}

const notifier = new Notifier();
module.exports = notifier;
