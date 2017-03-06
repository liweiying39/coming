'use strict';

const uuid = require('node-uuid');

module.exports = function (sequelize, DataTypes) {
  var InviteCode = sequelize.define('InviteCode', {
    event_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    creator_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    code: {
      allowNull: false,
      type: DataTypes.STRING
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    user_name: {
      type: DataTypes.STRING
    },
    is_used: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN
    },
    used_at: {
      type: DataTypes.DATE
    },
  }, {
    tableName: 'invite_codes',
    classMethods: {
      generate: function* ({ event_id, creator_id }) {
        let content;
        let is_exist;
        do {
          let random = uuid.v1().toString();
          content = (random.slice(-4) + random.slice(0, 4)).toUpperCase();
          is_exist = yield* InviteCode.checkValidity(content, event_id);
        } while (is_exist);
        return yield InviteCode.create({
          creator_id: creator_id,
          event_id: event_id,
          code: content
        });
      },
      checkValidity: function* (content, event_id) {
        let code = yield InviteCode.findOne({
          where: { event_id: event_id, code: content.toString().toUpperCase() }
        });
        return code || null;
      }
    },
    instanceMethods: {
      getData: function* (data, config) {
        const self = this;

        let result = {
          code: self.code,
          name: self.user_name || null,
          is_used: self.is_used,
          used_at: (+self.used_at)
        };

        if (data && typeof data === 'object')
          return Object.assign(result, data);
        else
          return result;
      }
    }
  });
  return InviteCode;
};