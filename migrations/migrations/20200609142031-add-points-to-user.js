'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'points', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    }),

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, _Sequelize) => {
    queryInterface.removeColumn('users', 'points');
  }
};