'use strict';

const co = require('co');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return co(function* () {
      yield queryInterface.addColumn('user_event_relations', 'offer', { type: Sequelize.STRING });
      yield queryInterface.addColumn('user_event_relations', 'need', { type: Sequelize.STRING });
      yield queryInterface.removeColumn('users', 'offer');
      yield queryInterface.removeColumn('users', 'need');
    });
  },

  down: function (queryInterface, Sequelize) {
    return co(function* () {
      yield queryInterface.removeColumn('user_event_relations', 'offer');
      yield queryInterface.removeColumn('user_event_relations', 'need');
      yield queryInterface.addColumn('users', 'offer', { type: Sequelize.STRING });
      yield queryInterface.addColumn('users', 'need', { type: Sequelize.STRING });
    });
  }
};
