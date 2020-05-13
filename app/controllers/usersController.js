const logger = require('../logger');
const User = require('../models').user;

const validateUserFields = require('../helpers/validationsHelper');
const hashPassword = require('../helpers/passwordHasherHelper');

exports.createUser = ({ body }, res) => {
  validateUserFields(body)
    .then(validFields => hashPassword(validFields))
    .then(hashedFields => User.create(hashedFields))
    .then(user => res.status(201).json(user))
    .catch(error => {
      logger.error(`Failed to created a user: ${error}`);
      res.status(400).send({ message: error.message });
    });
};
