const { healthCheck } = require('./controllers/healthCheck');
const { createUser } = require('./controllers/usersController');

const { checkMailIsAlreadyInUse, checkUserSchema } = require('./middlewares/user');

exports.init = app => {
  app.get('/health', healthCheck);

  app.post('/users', [checkUserSchema, checkMailIsAlreadyInUse], createUser);
};
