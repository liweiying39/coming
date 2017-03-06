"use strict";

module.exports = {

  handleError: function (res, handler) {
    let status = res.status;
    if (status in handler)
      return handler[status](res);
    if ('default' in handler)
      return handler['default'](res);
    throw res;
  },

  handleSocketMessage: function (ctx, message, handler) {
    if (message.type in handler)
      return handler[message.type].call(ctx, JSON.parse(JSON.stringify(message)));
    throw new Error(`no '${message.type}' type handler`);
  }

};
