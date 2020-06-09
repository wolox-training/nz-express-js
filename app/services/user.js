const { databaseError } = require('../errors');
const User = require('../models').user;
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
