const app = require('./app');
const migrationsManager = require('./migrations');
const config = require('./config');
const logger = require('./app/logger');
const runJobs = require('./app/jobs');

const port = config.common.api.port || 8080;

Promise.resolve()
  .then(() => migrationsManager.check())
  .then(() => {
    app.listen(port);

    logger.info(`Listening on port: ${port}`);
  })
  .then(() => {
    logger.info('Running jobs');
    runJobs();
  })
  .catch(logger.error);
