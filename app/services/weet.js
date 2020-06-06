const { databaseError } = require('../errors');
const Weet = require('../models').weet;
const logger = require('../logger');

exports.createWeet = (user, randomQuote) =>
  Weet.create({ content: randomQuote, userId: user.id }).catch(error => {
    logger.error(`Failed to create weet: ${error.message}`);
    throw databaseError('Unable to create the weet');
  });

exports.listWeets = ({ query }) => {
  logger.info('Listing weets...');
  return Weet.findAndCountAll({
    limit: query.limit,
    offset: query.limit * query.page
  });
};
