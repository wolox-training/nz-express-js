const db = require('../models');
const { findUserByEmail, findUser } = require('../services/user');
const { findWeet } = require('../services/weet');
const Rating = require('../models').rating;

exports.createRating = async (weetId, userEmail, score) => {
  const ratingAuthor = await findUserByEmail(userEmail);
  const weet = await findWeet(parseInt(weetId));
  const weetAuthor = await findUser(weet.userId);
  const [rating] = await Rating.findOrBuild({
    where: {
      weetId: parseInt(weetId),
      ratingUserId: ratingAuthor.id
    }
  });

  let transaction = {};

  try {
    transaction = await db.sequelize.transaction();

    if (rating.score !== score) {
      await weetAuthor.increment('points', { by: score, transaction });
      await rating.set('score', score);
      await rating.save({ transaction });
    }

    await transaction.commit();
  } catch (err) {
    if (transaction.rollback) await transaction.rollback();
    throw err;
  }
};
