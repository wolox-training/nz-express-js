const errors = require('../errors');
const logger = require('../logger');

const HTTP_CODES = require('../constants/httpCodes');

const DEFAULT_STATUS_CODE = HTTP_CODES.INTERNAL_ERROR;

const statusCodes = {
  [errors.DATABASE_ERROR]: HTTP_CODES.SERVICE_UNAVAILABLE,
  [errors.DEFAULT_ERROR]: HTTP_CODES.INTERNAL_ERROR,
  [errors.MODEL_VALIDATION_ERROR]: HTTP_CODES.BAD_REQUEST,
  [errors.EMAIL_ALREADY_IN_USE]: HTTP_CODES.BAD_REQUEST
};

exports.handle = (error, req, res, next) => {
  if (error.internalCode) res.status(statusCodes[error.internalCode] || DEFAULT_STATUS_CODE);
  else {
    // Unrecognized error, notifying it to rollbar.
    next(error);
    res.status(DEFAULT_STATUS_CODE);
  }
  logger.error(error);
  return res.send({ message: error.message, internal_code: error.internalCode });
};
