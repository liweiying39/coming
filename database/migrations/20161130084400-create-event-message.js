'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('event_messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      target_user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      event_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING
      },
      is_read: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
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
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('EventMessages');
  }
};