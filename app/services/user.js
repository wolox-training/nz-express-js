const { findLastKey } = require('lodash');

const User = require('../models').user;
const POSITIONS = require('../constants/userPositions');

const hashPassword = require('../helpers/passwordHasherHelper');
const logger = require('../logger');

exports.findUserByEmail = email => {
  logger.info(`Searching user by email: ${email}`);
  return User.findOne({
    where: {
      email
    }
  });
};

exports.createUser = body => {
  logger.info('Creating user...');
  return hashPassword(body)
    .then(userParams => User.create(userParams))
    .catch(error => {
      logger.error(`Failed to create user: ${error.message}`);
      throw databaseError('Unable to create the user');
    });
};

exports.listUser = request => {
  logger.info('Listing users...');
  return User.findAndCountAll({
    limit: request.query.limit,
    offset: request.skip
  }).catch(error => {
    logger.error(`Failed to list users: ${error.message}`);
    throw databaseError('Unable to list users');
  });
};

exports.updateToAdminUser = user => {
  logger.info('Updating user with admin priviliges...');
  return user.update({ admin: true });
};

<<<<<<< HEAD
exports.getPosition = async userPromise => {
  logger.info('Getting user position...');

  console.log(weetsId);

  return Rating.findAll({
    attributes: [[Sequelize.fn('sum', Sequelize.col('score')), 'totalScore']],
    include: [Weet],
    where: {
      id: {
        [Sequelize.op.in]: userPromise
          .then(user => user.getWeets())
          .then(weetsArray => weetsArray.map(weet => weet.id))
      }
    }
  });
};
=======
exports.getPosition = ({ points }) => findLastKey(POSITIONS, positionScore => positionScore <= points);
>>>>>>> Fix test
