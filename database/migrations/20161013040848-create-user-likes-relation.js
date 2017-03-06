'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('user_likes_relations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      target_user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: 'user_likes_relation'
      },
      from_user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: 'user_likes_relation'
      },
      event_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: 'user_likes_relation'
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
    return queryInterface.dropTable('user_likes_relations');
  }
};