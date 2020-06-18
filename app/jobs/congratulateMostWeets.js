const { CronJob } = require('cron');

const { findMostWordsAuthor } = require('../services/user');
const { sendPlainEmail } = require('../services/mailer');

const { congratulationsEmail } = require('../templates/mailer/congratulations');
const logger = require('../logger');

module.exports = new CronJob('* * * * *', async () => {
  try {
    logger.info('Starting congratulations mail sender..');
    const mayorWeetUser = await findMostWordsAuthor();
    sendPlainEmail(
      [mayorWeetUser.email],
      congratulationsEmail.subject,
      congratulationsEmail.body(mayorWeetUser)
    );
  } catch (err) {
    throw err;
  }

  logger.info('Finish congratulations mail sender...');
});
