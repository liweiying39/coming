'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('event_codes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reseller_id: {
        type: Sequelize.INTEGER,
      },
      manager_id: {
        type: Sequelize.INTEGER,
      },
      code: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      event_id: {
        type: Sequelize.INTEGER
      },
      is_used: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      used_time: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('event_codes');
  }
};