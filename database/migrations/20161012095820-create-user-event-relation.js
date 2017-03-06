'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('user_event_relations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: 'user_event_relation',
        references: {
          model: 'users',
          key: 'id'
        }
      },
      event_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: 'user_event_relation',
        references: {
          model: 'events',
          key: 'id'
        }
      },
      is_rsvp: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      is_checkin: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      is_checkout: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      likes: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      role: {
        allowNull: false,
        defaultValue: 'participant',
        type: Sequelize.ENUM,
        values: ['participant', 'manager']
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DATE
      }
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('user_event_relations');
  }
};