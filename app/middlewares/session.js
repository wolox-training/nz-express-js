const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { findUserByEmail } = require('../services/user');
const { sessionError, unauthorizedError } = require('../errors');
const logger = require('../logger');

const {
  session: { secret }
} = require('../../config').common;

const findUser = (request, _response, next) => {
  // eslint-disable-next-line consistent-return
  findUserByEmail(request.body.email).then(user => {
    if (!user) return next(sessionError('User not found'));
    request.user = user;
    next();
  });
};

const comparePassword = (request, _response, next) => {
  const givenPassword = request.body.password;
  const { user } = request;

  bcrypt.compare(givenPassword, user.password, (err, res) => {
    if (res) {
      next();
    } else {
      next(sessionError('Password not match'));
    }
  });
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
