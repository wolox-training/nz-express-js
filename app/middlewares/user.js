const { emailRepeatedError } = require('../errors');
const { findUserByEmail } = require('../services/user');
const logger = require('../logger');

exports.checkMailIsAlreadyInUse = ({ body: { email } }, _response, next) => {
  findUserByEmail(email).then(user => {
    if (user) {
      logger.error(`Unable to create a duplicate user with email: ${email}`);
      next(emailRepeatedError('Email already in use'));
    } else {
      next();
    }
  });
};
