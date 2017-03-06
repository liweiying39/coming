'use strict';
module.exports = function (sequelize, DataTypes) {
  var EventMessage = sequelize.define('EventMessage', {
    target_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      set: function (value) {
        let _value = typeof value == 'string' ? value : JSON.stringify(value);
        this.setDataValue('content', encodeURIComponent(_value));
      },
      get: function () {
        return decodeURIComponent(this.getDataValue('content'));
      }
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      set: function (value) {
        if (value == 'true' || value == '1')
          value = true;
        if (value == 'false' || value == '0')
          value = false;
        this.setDataValue('is_read', Boolean(value));
      }
    }
  }, {
    tableName: 'event_messages',
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    instanceMethods: {
      getData: function* (data, config) {
        const self = this;

        let content = self.content;
        try {
          content = JSON.parse(self.content);
        } catch (err) {
        }

        let result = {
          event_id: self.event_id,
          content: content
        };
        if (data)
          return Object.assign(result, data);
        else
          return result;
      }
    }
  });
  return EventMessage;
};