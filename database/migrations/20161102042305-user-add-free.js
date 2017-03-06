'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'free_event_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'free_event_count')
  }
};
