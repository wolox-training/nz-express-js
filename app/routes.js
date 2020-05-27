const paginate = require('express-paginate');

const { healthCheck } = require('./controllers/healthCheck');
const { createUser, indexUser } = require('./controllers/usersController');
const { createSession } = require('./controllers/sessionsController');

const { checkMailIsAlreadyInUse } = require('./middlewares/user');
const { validateSchema } = require('./middlewares/schema_validator');
const { validatePassword, authenticateEndpoint } = require('./middlewares/session');

const { userSchema } = require('./schemas/user');
const { sessionSchema } = require('./schemas/session');

exports.init = app => {
  app.get('/health', healthCheck);

  app.post('/users', [validateSchema(userSchema), checkMailIsAlreadyInUse], createUser);
  app.get('/users', [authenticateEndpoint, paginate.middleware(3, 5)], indexUser);
  app.post('/users/sessions', [validateSchema(sessionSchema), validatePassword], createSession);
};
