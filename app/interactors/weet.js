const { weetContentError } = require('../errors');
const { findUserByEmail } = require('../services/user');
const { createWeet } = require('../services/weet');
const { getFacts } = require('../services/number');

exports.createWeet = async ({ user }) => {
  const dbUser = await findUserByEmail(user.email);
  const randomQuote = await getFacts(Math.ceil(Math.random() * 100));
  if (randomQuote.length > 140) {
    throw weetContentError('Weet is too long');
  }

  return createWeet(dbUser, randomQuote);
};
