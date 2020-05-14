const validateUserFields = require('../helpers/validationsHelper');
const { modelValidationError } = require('../errors');
const logger = require('../logger');

module.exports = ({ body }, _response, next) => {
  if (validateUserFields(body)) {
    next();
  } else {
    logger.error(`Invalid user params: ${body}`);
    next(modelValidationError('Invalid user input'));
  }
};
