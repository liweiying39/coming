'use strict';
module.exports = function(sequelize, DataTypes) {
  var VerificationCode = sequelize.define('VerificationCode', {
    destination: {
      allowNull: false,
      type: DataTypes.STRING
    },
    code: {
      allowNull: false,
      type: DataTypes.STRING
    },
    ip_address: {
      allowNull: false,
      type: DataTypes.STRING
    },
    is_used: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN
    },
    use_for: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ['telephone', 'email']
    },
  }, {
    tableName: 'verification_codes',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return VerificationCode;
};