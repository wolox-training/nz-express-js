const { weetContentError, databaseError } = require('../errors');
const Weet = require('../models').weet;
const { getFacts } = require('../services/number');
const logger = require('../logger');

exports.createWeet = async user => {
  const randomQuote = await getFacts(Math.ceil(Math.random() * 100));

  if (randomQuote.lenght > 140) {
    throw weetContentError('Weet is too long');
  }

  return Weet.create({ content: randomQuote, userId: user.id }).catch(error => {
    logger.error(`Failed to create weet: ${error.message}`);
    throw databaseError('Unable to create the weet');
  });
};
