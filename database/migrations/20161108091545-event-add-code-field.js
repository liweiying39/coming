'use strict';

const co = require('co');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface
      .addColumn('events', 'event_code',
        {
          type: Sequelize.STRING,
          allowNull: false
        },
        {
          indexes: [{ name: 'event_code_index', fields: ['event_code'] }]
        });
  },

  down: function (queryInterface, Sequelize) {
    return co(function* () {
      yield queryInterface.removeIndex('events', 'event_code');
      yield queryInterface.removeColumn('events', 'event_code');
    });
  }
};
