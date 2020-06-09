const { createUser } = require('../interactors/user');

const HTTP_CODES = require('../constants/httpCodes');
const logger = require('../logger');

exports.createUser = ({ body }, res, next) => {
  createUser(body)
    .then(user => {
      logger.info(`Created user with id: ${user.id}`);
      res.status(HTTP_CODES.CREATED).json(user);
    })
    .catch(error => {
      next(error);
    });
};
