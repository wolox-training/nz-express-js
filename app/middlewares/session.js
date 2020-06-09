const bcrypt = require('bcrypt');
const util = require('util');

const { findUserByEmail } = require('../services/user');
const { sessionError } = require('../errors');

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

exports.validatePassword = [findUser, comparePassword];
