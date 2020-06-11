const HTTP_CODES = require('../constants/httpCodes');

const { createRating } = require('../interactors/rating');

exports.createRating = ({ params, user, body }, res, next) => {
  createRating(params.id, user.email, body.score)
    .then(() => {
      res.sendStatus(HTTP_CODES.OK);
    })
    .catch(e => next(e));
};
