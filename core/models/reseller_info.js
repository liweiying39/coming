'use strict';
module.exports = function (sequelize, DataTypes) {
  var ResellerInfo = sequelize.define('ResellerInfo', {
    reseller_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    status: {
      allowNull: false,
      defaultValue: 'valid',
      type: DataTypes.ENUM,
      values: ['valid', 'canceled']
    },
    inventory: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER,
      validate: {
        min: 0
      }
    },
  }, {
    tableName: 'reseller_infos',
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    instanceMethods: {

      isValid: function () {
        return this.status === 'valid';
      }

    }
  });
  return ResellerInfo;
};