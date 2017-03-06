'use strict';
module.exports = function (sequelize, DataTypes) {
  var Config = sequelize.define('Config', {
    key: {
      allowNull: false,
      type: DataTypes.STRING
    },
    value: {
      allowNull: false,
      type: DataTypes.STRING
    },
  }, {
    tableName: 'configs',
    classMethods: {
      write: function* (key, value) {
        let config = yield Config.findOne({ where: { key: key } });
        if (!config)
          config = yield Config.create({
            key: key,
            value: value
          });
        else
          yield config.update({value: value});

        return value;
      },
      read: function* (key) {
        let config = yield Config.findOne({ where: {key: key} });
        return config ? config.value : null;
      }
    }
  });
  return Config;
};