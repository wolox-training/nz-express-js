const { databaseError } = require('../errors');
const { createUser } = require('../services/user');

const HTTP_CODES = require('../constants/httpCodes');
const logger = require('../logger');

exports.createUser = ({ body }, res, next) => {
  createUser(body)
    .then(user => {
      logger.info(`Created user with id: ${user.id}`);
      res.status(HTTP_CODES.CREATED).json(user);
    })
    .catch(error => {
      logger.error(`Failed to create user: ${error.message}`);
      next(databaseError('Unable to create the user'));
    });
};

exports.indexUser = (request, response, next) => {
  response.status(HTTP_CODES.OK).json({bien: "vieja"});
};
