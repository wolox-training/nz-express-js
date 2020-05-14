const { healthCheck } = require('./controllers/healthCheck');
const { createUser } = require('./controllers/usersController');

const validateUserParams = require('./middlewares/user');

exports.init = app => {
  app.get('/health', healthCheck);

  app.post('/users', validateUserParams, createUser);
};
