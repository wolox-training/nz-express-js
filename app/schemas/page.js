const isANaturalNumber = val => val > 0;

exports.pageSchema = {
  page: {
    in: 'query',
    custom: {
      errorMessage: 'Page must be 1 or more',
      options: isANaturalNumber
    },
    customSanitizer: {
      options: val => parseInt(val)
    }
  },
  limit: {
    in: 'query',
    custom: {
      errorMessage: 'Limit must be 1 or more',
      options: isANaturalNumber
    },
    customSanitizer: {
      options: val => parseInt(val)
    }
  }
};
