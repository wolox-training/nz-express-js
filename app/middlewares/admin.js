const { unauthorizedError, sessionError } = require('../errors');
const { findUserByEmail } = require('../services/user');

exports.validateAdminUser = ({ user: { email } }, res, next) => {
  // eslint-disable-next-line consistent-return
  findUserByEmail(email).then(dbUser => {
    if (!dbUser) return next(sessionError('User not found'));
    if (!dbUser.admin) return next(unauthorizedError('Unauthorized'));
    next();
  });
};
