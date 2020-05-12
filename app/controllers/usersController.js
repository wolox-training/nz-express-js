const bcrypt = require('bcrypt');
const logger = require('../logger');

const db = require('../models/index');
const emailValidator = require('../helpers/emailVerificationHelper');
const passwordValidator = require('../helpers/passwordVerificationHelper');

const User = db.sequelize.models.users;

function validateUserFields(body) {
  if (emailValidator(body.email) && passwordValidator(body.password)) {
    return Promise.resolve(body);
  }
  return Promise.reject(new Error('Invalid user fields'));
}

function hashPassword(body) {
  const { password } = body;
  const saltRounds = 10;

  const hashedPassword = new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) reject(err);
      resolve({ ...body, password: hash });
    });
  });

  return hashedPassword;
}

function insertUser(body) {
  User.create(body).then(logger.info(`${body.firstName} created`));
}

exports.createUser = ({ body }, res) => {
  validateUserFields(body)
    .then(validFields => hashPassword(validFields))
    .then(validAndHashFields => insertUser(validAndHashFields))
    .then(user => res.status(201).json(user))
    .catch(error => {
      logger.error(`Failed to created a user: ${error}`);
      res.status(400).send({ message: error.message });
    });
};
