'use strict';

const uuid = require('node-uuid');

module.exports = function (sequelize, DataTypes) {
  var EventCode = sequelize.define('EventCode', {
    reseller_id: {
      type: DataTypes.INTEGER,
    },
    manager_id: {
      type: DataTypes.INTEGER,
    },
    code: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    event_id: {
      type: DataTypes.INTEGER
    },
    is_used: {
      defaultValue: false,
      type: DataTypes.BOOLEAN
    },
    used_time: {
      type: DataTypes.DATE
    },
  }, {
    tableName: 'event_codes',
    classMethods: {
      generateMany: function (times) {
        times = times || 1;
        let codes = [];
        for (let i = 0; i < times; i++) {
          codes.push({
            code: uuid.v1()
          })
        }
        return EventCode.bulkCreate(codes);
      },
      generate: function* ({ reseller_id, manager_id }) {
        let content;
        let is_exist;
        do {
          let random = uuid.v1().toString();
          content = (random.slice(-4) + random.slice(0, 4)).toUpperCase();
          is_exist = yield* EventCode.checkValidity(content);
        } while (is_exist);
        return yield EventCode.create({
          manager_id: manager_id || null,
          reseller_id: reseller_id,
          code: content,
        })
      },
      checkValidity: function* (content) {
        let code = yield EventCode.findOne({ where: { code: content.toString().toUpperCase() } });
        return code || null;
      }
    },
    instanceMethods: {
      getData: function* (data, config) {
        const self = this;

        let result = {
          manager_id: self.manager_id,
          code: self.code,
          event_id: self.event_id,
          is_used: self.is_used,
          used_time: self.used_time ? parseInt(self.used_time) : null
        };
        if (data)
          return Object.assign(result, data);
        else
          return result;
      }
    }
  });

  return EventCode;
};