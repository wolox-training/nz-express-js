const axios = require('axios');
const logger = require('../logger');

exports.getFacts = number => {
  const url = process.env.NUMBERS_BASE_URL + number;
  axios.get(url).then(({ data }) => {
    logger.info(`Fetch number ${number} fact at ${url}: ${data}`);
    return data;
  });
};
