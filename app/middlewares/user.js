const { validationResult, checkSchema } = require('express-validator');

const { emailSchema, passwordSchema } = require('../schemas/user');
const { modelValidationError, emailRepeatedError } = require('../errors');
const { findUserByEmail } = require('../services/user');
const logger = require('../logger');

exports.checkMailIsAlreadyInUse = ({ body: { email } }, _response, next) => {
  findUserByEmail(email).then(user => {
    if (user) {
      logger.error(`Unable to create a duplicate user with email: ${email}`);
      next(emailRepeatedError('Email already in use'));
    } else {
      next();
    }
  });
};

exports.checkUserSchema = () => [
  checkSchema({
    email: emailSchema,
    password: passwordSchema,
    firstName: {
      exists: {
        errorMessage: 'First name must be present'
      }
    },
    lastName: {
      exists: {
        errorMessage: 'Last name must be present'
      }
    }
  }),
  (request, _response, next) => {
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      next();
    } else {
      const errorMessage = errors.map(error => error.msg).join('; ');

      logger.error(`Invalid user params: ${errorMessage}`);
      next(modelValidationError(errorMessage));
    }
  }
];
