'use strict';

const jwt = require('../single/jwt.js');
const config = require('../../config/index');

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      set: function(value) {
        this.setDataValue('name', encodeURIComponent(value));
      },
      get: function() {
        return decodeURIComponent(this.getDataValue('name'));
      }
    },
    role: {
      allowNull: false,
      defaultValue: 'client',
      type: DataTypes.ENUM,
      values: ['client', 'reseller', 'admin']
    },
    avatar: {
      type: DataTypes.STRING
    },
    job_title: {
      type: DataTypes.STRING
    },
    organization: {
      type: DataTypes.STRING
    },
    wechat_openid: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING
    },
    telephone: {
      type: DataTypes.STRING
    },
    free_event_count: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    }
  }, {
    tableName: 'users',
    classMethods: {
      associate: function (models) {

        User.belongsToMany(models.Event, {
          through: {
            model: models.UserEventRelation,
            unique: false
          },
          foreignKey: 'user_id'
        });

        User.hasOne(models.ResellerInfo, {
          foreignKey: 'reseller_id'
        });

      },
      verifyToken: function* (token) {
        let user_id = null;
        jwt.verify(token, (err, data) => {
          if (err) return;
          return data.user_id;
        });

        if (!user_id)
          return null;

        let user = yield User.findOneById(user_id);
        return user || null;
      }
    },
    instanceMethods: {
      getData: function* (data, config) {
        const self = this;

        let events = yield self.getEvents();

        let information = {
          interesting_count: events.length,
          job_title: self.job_title || '',
          organization: self.organization || '',
        };

        if (config && config.managing_count)
          information.managing_count = events.filter((event) => event.UserEventRelation.role === 'manager').length;

        let result = {
          user_id: self.id,
          name: self.name || '',
          role: self.role,
          avatar: self.avatar || '',
          telephone: self.telephone || '',
          free_event_count: self.free_event_count,
          information: information
        };
        if (data && typeof data === 'object')
          return Object.assign(result, data);
        else
          return result;
      },

      generateToken() {
        return jwt.generate({ user_id: this.id }, config.token_expire_in);
      },

      checkRole(role) {
        return this.role === role;
      }
    }
  });

  return User;
};