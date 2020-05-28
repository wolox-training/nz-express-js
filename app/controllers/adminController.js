const { findUserByEmail, createUser, updateToAdminUser } = require('../services/user');
const HTTP_CODES = require('../constants/httpCodes');
const { userSerializer } = require('../serializers/user');
const logger = require('../logger');
const { databaseError } = require('../errors');

exports.createAdminUser = ({ body }, res, next) => {
  findUserByEmail(body.email)
    .then(user => {
      if (user) {
        updateToAdminUser(user).then(updatedUser => {
          logger.info(`Setting admin privilege for user with id: ${updatedUser.id}`);
          res.status(HTTP_CODES.OK).json(userSerializer(updatedUser));
        });
      } else {
<<<<<<< HEAD
        createUser({ ...body, admin: true }).then(newUser => {
          logger.info(`Created user with id: ${newUser.id} and admin privileges`);
          res.status(HTTP_CODES.CREATED).json(userSerializer(newUser));
=======
        createUser({ ...body, admin: true }).then(neWuser => {
          logger.info(`Created user with id: ${neWuser.id} and admin privileges`);
          res.status(HTTP_CODES.CREATED).json(userSerializer(neWuser));
>>>>>>> Creqte admin user
        });
      }
    })
    .catch(error => {
      logger.error(`Failed to create admin user: ${error.message}`);
      next(databaseError('Unable to create admin user'));
    });
};
