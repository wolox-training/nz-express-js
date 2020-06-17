const HTTP_CODES = require('../constants/httpCodes');
const logger = require('../logger');

const { createWeet } = require('../interactors/weet');
const { weetSerializer } = require('../serializers/weet');

exports.createWeet = (req, res, next) => {
  createWeet(req)
    .then(weet => {
      logger.info(`Created weet with id: ${weet.id}`);
      res.status(HTTP_CODES.CREATED).json(weetSerializer(weet));
    })
    .catch(e => next(e));
};
