'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      role: {
        allowNull: false,
        defaultValue: 'client',
        type: Sequelize.ENUM,
        values: ['client', 'reseller', 'admin']
      },
      avatar: {
        type: Sequelize.STRING
      },
      job_title: {
        type: Sequelize.STRING
      },
      organization: {
        type: Sequelize.STRING
      },
      need: {
        type: Sequelize.STRING
      },
      offer: {
        type: Sequelize.STRING
      },
      is_sharing_showup: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      last_showup_time: {
        type: Sequelize.DATE
      },
      last_showup_location: {
        type: Sequelize.STRING
      },
      wechat_openid: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
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
    return queryInterface.dropTable('users');
  }
};