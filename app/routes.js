const { healthCheck } = require('./controllers/healthCheck');
const { createUser } = require('./controllers/usersController');
const { createSession } = require('./controllers/sessionsController');

const { validateSchema } = require('./middlewares/schema_validator');
const { validatePassword } = require('./middlewares/session');

const { userSchema } = require('./schemas/user');
const { sessionSchema } = require('./schemas/session');

exports.init = app => {
  app.get('/health', healthCheck);

  app.post('/users', [validateSchema(userSchema)], createUser);
  app.post('/users/sessions', [validateSchema(sessionSchema), validatePassword], createSession);
};
