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
exports.weetContentError = message => internalError(message, exports.MODEL_VALIDATION_ERROR);

exports.EMAIL_ALREADY_IN_USE = 'email_already_in_use';
exports.emailRepeatedError = message => internalError(message, exports.EMAIL_ALREADY_IN_USE);

exports.SESSION_ERROR = 'password_or_email_incorrect';
exports.sessionError = message => internalError(message, exports.SESSION_ERROR);

exports.UNAUTHORIZED_ERROR = 'unauthorized';
exports.unauthorizedError = message => internalError(message, exports.UNAUTHORIZED_ERROR);

exports.PAGE_DOES_NOT_EXIST = 'page_does_not_exist';
exports.pageLimitExceed = message => internalError(message, exports.PAGE_DOES_NOT_EXIST);

exports.WEET_NOT_FOUND = 'weet_not_found';
exports.weetNotFound = message => internalError(message, exports.WEET_NOT_FOUND);

exports.USER_NOT_FOUND = 'user_not_found';
exports.userNotFound = message => internalError(message, exports.USER_NOT_FOUND);
