'use strict';
module.exports = function (sequelize, DataTypes) {
  var UserEventRelation = sequelize.define('UserEventRelation', {
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      unique: 'user_event_relation',
    },
    event_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      unique: 'user_event_relation',
    },
    is_rsvp: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
      set: function (value) {
        if (value === 'true' || value === '1')
          value = true;
        if (value === 'false' || value === '0')
          value = false;
        this.setDataValue('is_rsvp', Boolean(value));
      }
    },
    is_checkin: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
      set: function (value) {
        if (value === 'true' || value === '1')
          value = true;
        if (value === 'false' || value === '0')
          value = false;
        this.setDataValue('is_checkin', Boolean(value));
      }
    },
    is_checkout: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
      set: function (value) {
        if (value === 'true' || value === '1')
          value = true;
        if (value === 'false' || value === '0')
          value = false;
        this.setDataValue('is_checkout', Boolean(value));
      }
    },
    likes: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER,
      validate: {
        min: 0
      }
    },
    role: {
      allowNull: false,
      defaultValue: 'participant',
      type: DataTypes.ENUM,
      values: ['participant', 'manager']
    },
    offer: {
      type: DataTypes.STRING
    },
    need: {
      type: DataTypes.STRING
    },
    is_sharing_showup: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
      set: function (value) {
        if (value === 'true' || value === '1')
          value = true;
        if (value === 'false' || value === '0')
          value = false;
        this.setDataValue('is_sharing_showup', Boolean(value));
      }
    },
    last_showup_time: {
      type: DataTypes.DATE
    },
    last_showup_location: {
      type: DataTypes.STRING
    },
    rsvped_at: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'user_event_relations',
    classMethods: {
      associate: function (models) {

      }
    },
    underscored: true,
    instanceMethods: {
      getData: function* (data, config) {
        const self = this;

        let result = {
          i_offer: self.offer || '',
          i_need: self.need || '',
          event_id: self.event_id,
          likes: self.likes,
          role: self.role,
          is_sharing_showup: self.is_sharing_showup,
          status: {
            is_rsvp: self.is_rsvp || false,
            is_checkin: self.is_checkin || false,
            is_checkout: self.is_checkout || false
          }
        };

        if (config && config.show_is_invited)
          result.status.is_invited = self.is_invited;

        if (result.is_sharing_showup) {
          result.last_showup_time = (+self.last_showup_time);
          result.last_showup_location = self.last_showup_location || '';
        }
        if (data)
          return Object.assign(result, data);
        else
          return result;
      },

      checkRole(role) {
        return this.role === role;
      }
    },
    getterMethods: {
      is_invited: function () {
        return Boolean(this.rsvped_at);
      }
    }
  });
  return UserEventRelation;
};