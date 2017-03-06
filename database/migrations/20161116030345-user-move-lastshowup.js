'use strict';

const co = require('co');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return co(function* () {
      yield queryInterface.addColumn('user_event_relations', 'is_sharing_showup',
        { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false });
      yield queryInterface.addColumn('user_event_relations', 'last_showup_time', { type: Sequelize.DATE });
      yield queryInterface.addColumn('user_event_relations', 'last_showup_location', { type: Sequelize.STRING });
      yield queryInterface.removeColumn('users', 'is_sharing_showup');
      yield queryInterface.removeColumn('users', 'last_showup_time');
      yield queryInterface.removeColumn('users', 'last_showup_location');
    });
  },

  down: function (queryInterface, Sequelize) {
    return co(function* () {
      yield queryInterface.addColumn('users', 'is_sharing_showup',
        { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false });
      yield queryInterface.addColumn('users', 'last_showup_time', { type: Sequelize.DATE });
      yield queryInterface.addColumn('users', 'last_showup_location', { type: Sequelize.STRING });
      yield queryInterface.removeColumn('user_event_relations', 'is_sharing_showup');
      yield queryInterface.removeColumn('user_event_relations', 'last_showup_time');
      yield queryInterface.removeColumn('user_event_relations', 'last_showup_location');
    });
  }
};
