'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('ratings', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        ratingUserId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        weetId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'weets',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        score: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      })
      .then(() =>
        queryInterface.addConstraint('ratings', ['score'], {
          type: 'check',
          where: {
            score: [-1, 1]
          }
        })
      ),

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, _Sequelize) => queryInterface.dropTable('ratings')
};
