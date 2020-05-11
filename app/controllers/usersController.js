const db = require('../models/index');

const User = db.sequelize.models.users;

exports.createUser = (req, res) => {
  User.create(req.body)
    .then(user => res.status(201).json(user))
    .catch(error => {
      res.status(400).json(error)
    });
};
