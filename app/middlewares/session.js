const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');

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

const setCurrentUser = ({ email, iat }, request) => {
  findUserByEmail(email).then(dbUser => {
    if (dbUser.logoutTime && iat <= dbUser.logoutTime) throw unauthorizedError('Unauthorized');
    request.user = dbUser;
  });
};

// eslint-disable-next-line consistent-return
exports.authenticateEndpoint = (request, response, next) => {
  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const verifyJwt = util.promisify(jwt.verify);

  if (token === null) return next(unauthorizedError('Unauthorized'));

  try {
    const { error, result } = verifyJwt(token, secret);
    if (error) {
      logger.error(`Unauthorized access: ${error}`);
      next(unauthorizedError('Unauthorized'));
    } else {
      setCurrentUser(result, request);
      next();
    }
  } catch (err) {
    next(err);
  }
};

exports.validatePassword = [findUser, comparePassword];
