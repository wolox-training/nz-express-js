const jwt = require('jsonwebtoken');
const HTTP_CODES = require('../constants/httpCodes');

const {
  session: { secret }
} = require('../../config').common;

exports.createSession = ({ body: { email } }, res) => {
  const token = jwt.sign({ email }, secret, { expiresIn: '1800s' });
  res.status(HTTP_CODES.OK).json(token);
};
