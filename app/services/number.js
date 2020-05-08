const axios = require('axios');

exports.getFacts = number => axios.get(`http://numbersapi.com/${number}`).then(({ data }) => data);
