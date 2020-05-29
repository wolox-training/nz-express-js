const { emailRepeatedError, databaseError } = require('../errors');
const { findUserByEmail } = require('../services/user');
const { createUser } = require('../services/user');
const logger = require('../logger');

exports.createUser = ({ body }, res, next) =>
  findUserByEmail(body.email)
    .then(user => {
      if (user) {
        logger.error(`Unable to create a duplicate user with email: ${body.email}`);
        next(emailRepeatedError('Email already in use'));
      }
    })
    .then(() => createUser(body))
    .catch(error => {
      logger.error(`Failed to create user: ${error.message}`);
      next(databaseError('Unable to create the user'));
    });
