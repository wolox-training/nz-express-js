'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'logoutTime', {
      type: Sequelize.DATE,
      allowNull: true
    }),

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, _Sequelize) => {
    queryInterface.removeColumn('users', 'logoutTime');
  }
};
