const HTTP_CODES = require('../constants/httpCodes');
const logger = require('../logger');

const { createWeet, listWeet } = require('../interactors/weet');
const { weetSerializer } = require('../serializers/weet');
const { pageSerializer } = require('../services/page');

exports.createWeet = (req, res, next) => {
  createWeet(req)
    .then(weet => {
      logger.info(`Created weet with id: ${weet.id}`);
      res.status(HTTP_CODES.CREATED).json(weetSerializer(weet));
    })
    .catch(e => next(e));
};

exports.indexWeet = (req, res, next) => {
  listWeet(req)
    .then(result => {
      res.status(HTTP_CODES.OK).json(pageSerializer(result, req, weetSerializer));
    })
    .catch(e => next(e));
};
