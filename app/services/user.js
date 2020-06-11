const { findLastKey } = require('lodash');

const { userNotFound } = require('../errors');

const User = require('../models').user;
const POSITIONS = require('../constants/userPositions');

const { databaseError } = require('../errors');

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

exports.getPosition = ({ points }) => findLastKey(POSITIONS, positionScore => positionScore <= points);

exports.findUser = id =>
  User.findByPk(id).then(result => {
    if (result) return result;
    throw userNotFound('User not found');
  });
