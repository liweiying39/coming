'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('user_event_relations', 'rsvped_at', {
      type: Sequelize.DATE
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('user_event_relations', 'rsvped_at');
  }
};
