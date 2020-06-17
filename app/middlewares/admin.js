const { unauthorizedError } = require('../errors');

exports.validateAdminUser = ({ user }, res, next) => {
  if (!user.admin) return next(unauthorizedError('Unauthorized'));
  return next();
};
