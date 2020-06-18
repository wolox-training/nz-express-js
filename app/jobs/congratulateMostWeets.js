const { CronJob } = require('cron');
const logger = require('../logger');

const { findMostWordsAuthor } = require('../services/user');
const { sendPlainEmail } = require('../services/mailer');

const { congratulationsEmail } = require('../templates/mailer/congratulations');

logger.info('Congratulations job initializing...');
const job = new CronJob('00 00 00 * * *', async () => {
  try {
    const mayorWeetUser = await findMostWordsAuthor();
    sendPlainEmail(
      [mayorWeetUser.email],
      congratulationsEmail.subject,
      congratulationsEmail.body(mayorWeetUser)
    );
  } catch (err) {
    throw err;
  }
});
logger.info('Congratulations job finished initialization');
job.start();
