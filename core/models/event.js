'use strict';
module.exports = function (sequelize, DataTypes) {
  var Event = sequelize.define('Event', {
    manager_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    place: {
      type: DataTypes.STRING
    },
    event_page_url: {
      type: DataTypes.STRING
    },
    event_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    start_time: {
      type: DataTypes.DATE
    },
    end_time: {
      type: DataTypes.DATE
    },
  }, {
    tableName: 'events',
    classMethods: {
      associate: function (models) {
        Event.belongsTo(models.User, {
          foreignKey: 'manager_id',
          as: 'manager'
        });

        Event.belongsToMany(models.User, {
          through: {
            model: models.UserEventRelation,
            unique: false
          },
          foreignKey: 'event_id'
        });
      }
    },
    instanceMethods: {
      getData: function* (data, config) {
        const self = this;

        let result = {
          name: self.name,
          place: self.place,
          start_time: self.start_time ? self.start_time.getTime() : null,
          end_time: self.end_time ? self.end_time.getTime() : null,
          page_url: self.event_page_url || ''
        };
        if (data)
          return Object.assign(result, data);
        else
          return result;
      }
    }
  });
  return Event;
};