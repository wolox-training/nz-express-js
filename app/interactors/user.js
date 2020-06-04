const { emailRepeatedError } = require('../errors');
const { findUserByEmail } = require('../services/user');
const { createUser } = require('../services/user');
const logger = require('../logger');

exports.createUser = async userData => {
  const user = await findUserByEmail(userData.email);

  if (user) {
    logger.error(`Unable to create a duplicate user with email: ${userData.email}`);
    throw emailRepeatedError('Email already in use');
  }

  return createUser(userData);
};
