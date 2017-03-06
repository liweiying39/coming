'use strict';

const MESSAGE_PAGE_SIZE = 20;

const checkToken = require('../utils/auth.js').checkToken;
const db = require('../../core').getService('db');

function init (api) {

  api
    .use('/message', checkToken)

    .get('/message', function* (next) {
      const ctx = this;
      const current_user = ctx.current_user;

      let page = Number.parseInt(ctx.request.query.page) || 1;
      if (page <= 0)
        page = 1;

      let result = [];

      let messages = yield db.EventMessage.findAll({
        where: {
          target_user_id: current_user.id,
          is_read: false
        },
        order: [
          ['id', 'DESC']
        ],
        offset: (page - 1) * MESSAGE_PAGE_SIZE,
        limit: MESSAGE_PAGE_SIZE
      });

      for (let msg of messages) {
        result.push(yield* msg.getData());
      }

      return ctx.body = {
        messages: result,
        min_id: messages.length > 0 ? messages[messages.length - 1].id : null
      };
    })

    .put('/message', function* () {
      const ctx = this;
      const current_user = ctx.current_user;
      const request_body = ctx.request.body;

      if (!request_body.min_id)
        return ctx.fn.error(422, 'missing min_id');

      try {
        yield db.EventMessage
          .update({ is_read: true }, {
            where: {
              target_user_id: current_user.id,
              id: {
                $gte: Number.parseInt(request_body.min_id)
              }
            }
          });
      } catch (err) {
        console.error('put /message error: ' + JSON.stringify(err));
        console.error('``````````````````````' + JSON.stringify(request_body));
        return ctx.body = { done: false };
      }

      return ctx.body = { done: true };
    });

}

module.exports = init;
