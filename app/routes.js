const { healthCheck } = require('./controllers/healthCheck');
const { createUser } = require('./controllers/usersController');

const { checkMailIsAlreadyInUse } = require('./middlewares/user');
const { validateSchema } = require('./middlewares/schema_validator');

const { userSchema } = require('./schemas/user');

exports.init = app => {
  app.get('/health', healthCheck);

  app.post('/users', [validateSchema(userSchema), checkMailIsAlreadyInUse], createUser);
};
