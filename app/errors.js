const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.MODEL_VALIDATION_ERROR = 'model_validation_error';
exports.modelValidationError = message => internalError(message, exports.MODEL_VALIDATION_ERROR);

exports.EMAIL_ALREADY_IN_USE = 'email_already_in_use';
exports.emailRepeatedError = message => internalError(message, exports.EMAIL_ALREADY_IN_USE);

exports.SESSION_ERROR = 'password_or_email_incorrect';
exports.sessionError = message => internalError(message, exports.SESSION_ERROR);

exports.UNAUTHORIZED_ERROR = 'unathorized';
exports.unauthorizedError = message => internalError(message, exports.UNAUTHORIZED_ERROR);
