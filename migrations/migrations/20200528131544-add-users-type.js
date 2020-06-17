'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'admin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }),

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, _Sequelize) => {
    queryInterface.removeColumn('users', 'admin');
  }
};
