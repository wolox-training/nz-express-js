const axios = require('axios');
const logger = require('../logger');

const {
  numberService: { baseUrl }
} = require('../../config').common;

exports.getFacts = number => {
  const url = `${baseUrl}/${number}`;

  return axios.get(url).then(({ data }) => {
    logger.info(`Fetch number ${number} fact at ${url}: ${data}`);
    return data;
  });
};
