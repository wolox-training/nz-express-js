/* eslint-disable no-unused-vars */
'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.addIndex('users', ['email'], {
      unique: true
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.removeIndex('users', ['email'], {
      unique: true
    });
  }
};
