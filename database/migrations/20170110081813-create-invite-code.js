'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('invite_codes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      event_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      creator_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      user_name: {
        type: Sequelize.STRING
      },
      is_used: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      used_at: {
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
        defaultValue: null,
        type: Sequelize.DATE
      }
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('invite_codes');
  }
};