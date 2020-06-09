const { validationResult, checkSchema } = require('express-validator');

const logger = require('../logger');
const { modelValidationError } = require('../errors');

exports.validateSchema = schema => [
  checkSchema(schema),
  (request, _response, next) => {
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      next();
    } else {
      const errorMessage = errors
        .array()
        .map(error => error.msg)
        .join('; ');

      logger.error(`Invalid params for ${request.path}: ${errorMessage}`);
      next(modelValidationError(errorMessage));
    }
  }
];
