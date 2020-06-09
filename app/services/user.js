const Sequelize = require('sequelize');
const User = require('../models').user;
const Rating = require('../models').rating;
const Weet = require('../models').weet;

const hashPassword = require('../helpers/passwordHasherHelper');
const logger = require('../logger');

exports.findUserByEmail = email => {
  logger.info(`Searching user by email: ${email}`);
  return User.findOne({
    where: {
      email
    }
  });
};

exports.createUser = body => {
  logger.info('Creating user...');
  return hashPassword(body).then(userParams => User.create(userParams));
};

exports.listUser = request => {
  logger.info('Listing users...');
  return User.findAndCountAll({
    limit: request.query.limit,
    offset: request.skip
  });
};

exports.updateToAdminUser = user => {
  logger.info('Updating user with admin priviliges...');
  return user.update({ admin: true });
};

exports.getPosition = async userPromise => {
  logger.info('Getting user position...');

  console.log(weetsId);

  return Rating.findAll({
    attributes: [[Sequelize.fn('sum', Sequelize.col('score')), 'totalScore']],
    include: [Weet],
    where: {
      id: {
        [Sequelize.op.in]: userPromise
          .then(user => user.getWeets())
          .then(weetsArray => weetsArray.map(weet => weet.id))
      }
    }
  });
};
