'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('verification_codes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      destination: {
        allowNull: false,
        type: Sequelize.STRING
      },
      code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      ip_address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      is_used: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      use_for: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['telephone', 'email']
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
        type: Sequelize.DATE,
        defaultValue: null
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('verification_codes');
  }
};