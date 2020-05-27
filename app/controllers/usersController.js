const { databaseError } = require('../errors');
const hashPassword = require('../helpers/passwordHasherHelper');

const HTTP_CODES = require('../constants/httpCodes');
const logger = require('../logger');

const User = require('../models').user;

exports.createUser = ({ body }, res, next) => {
  hashPassword(body)
    .then(userParams => User.create(userParams))
    .then(user => res.status(HTTP_CODES.CREATED).json(user))
    .catch(error => {
      logger.error(`Failed to create user: ${error.message}`);
      next(databaseError('Unable to create the user'));
    });
};
