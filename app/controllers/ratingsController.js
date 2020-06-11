const HTTP_CODES = require('../constants/httpCodes');

exports.createRating = (_req, res) => {
  res.status(HTTP_CODES.CREATED).json({ hola: 'mimi' });
};
