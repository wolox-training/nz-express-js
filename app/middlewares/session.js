const bcrypt = require('bcrypt');
const util = require('util');
const jwt = require('jsonwebtoken');

const { findUserByEmail } = require('../services/user');
const { sessionError, unauthorizedError } = require('../errors');
const logger = require('../logger');

const {
  session: { secret }
} = require('../../config').common;

// eslint-disable-next-line consistent-return
const findUser = async (request, _response, next) => {
  const userEmail = request.body.email;

  try {
    const dbUser = await findUserByEmail(userEmail);
    if (!dbUser) return next(sessionError('User not found'));
    // eslint-disable-next-line require-atomic-updates
    request.user = dbUser;
    next();
  } catch (err) {
    next(err);
  }
};

const comparePassword = async (request, _response, next) => {
  const givenPassword = request.body.password;
  const { user } = request;

  const comparePasswordPromise = util.promisify(bcrypt.compare);

  try {
    const compareResult = await comparePasswordPromise(givenPassword, user.password);
    if (compareResult) {
      next();
    } else {
      next(sessionError('Password not match'));
    }
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.authenticateEndpoint = (request, response, next) => {
  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) return next(unauthorizedError('Unauthorized'));

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      logger.error(`Unauthorized access: ${err}`);
      next(unauthorizedError('Unauthorized'));
    } else {
      request.user = user;
      next();
    }
  });
};
exports.validatePassword = [findUser, comparePassword];
