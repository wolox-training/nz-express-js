const { createUser } = require('../interactors/user');

const HTTP_CODES = require('../constants/httpCodes');
const logger = require('../logger');

exports.createUser = (req, res, next) => {
  createUser(req, res, next).then(user => {
    logger.info(`Created user with id: ${user.id}`);
    res.status(HTTP_CODES.CREATED).json(user);
  });
};
