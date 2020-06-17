const jwt = require('jsonwebtoken');
const HTTP_CODES = require('../constants/httpCodes');

const { setLogoutTime } = require('../services/user');

const {
  session: { secret }
} = require('../../config').common;

exports.createSession = ({ body: { email } }, res) => {
  const token = jwt.sign({ email, iat: Date.now() }, secret, { expiresIn: '1800s' });
  res.status(HTTP_CODES.OK).json({ token });
};

exports.deleteSession = ({ user }, res, next) => {
  setLogoutTime(user)
    .then(() => res.sendStatus(HTTP_CODES.OK))
    .catch(err => next(err));
};
