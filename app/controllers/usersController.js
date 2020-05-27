const { createUser } = require('../interactors/user');
const { databaseError } = require('../errors');
const { listUser } = require('../services/user');
const { userSerializer } = require('../serializers/user');
const { pageSerializer } = require('../serializers/page');

const HTTP_CODES = require('../constants/httpCodes');
const logger = require('../logger');

exports.createUser = ({ body }, res, next) => {
  createUser(body)
    .then(user => {
      logger.info(`Created user with id: ${user.id}`);
      res.status(HTTP_CODES.CREATED).json(userSerializer(user));
    })
    .catch(error => {
      next(error);
    });
};

exports.indexUser = (request, response, next) => {
  listUser(request)
    .then(result => {
      response.status(HTTP_CODES.OK).json(pageSerializer(result, request, userSerializer));
    })
    .catch(error => {
      logger.error(`Failed to list users: ${error.message}`);
      next(databaseError('Unable to list users'));
    });
};
