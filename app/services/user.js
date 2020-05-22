const User = require('../models').user;
const hashPassword = require('../helpers/passwordHasherHelper');

exports.findUserByEmail = email => {
  User.findOne({
    where: {
      email
    }
  });
};

exports.createUser = body => {
  hashPassword(body).then(userParams => User.create(userParams));
};
