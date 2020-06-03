const { findUserByEmail } = require('../services/user');
const { createWeet } = require('../services/weet');

exports.createWeet = ({ user }, res, next) =>
  findUserByEmail(user.email)
    .then(dbUser => createWeet(dbUser))
    .catch(e => next(e));
