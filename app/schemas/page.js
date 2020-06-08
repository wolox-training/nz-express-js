const isANaturalNumber = val => Number.isInteger(val) && val > 0;

exports.pageSchema = {
  page: {
    in: 'query',
    custom: {
      errorMessage: 'Page must be 1 or more',
      options: isANaturalNumber
    }
  },
  limit: {
    in: 'query',
    custom: {
      errorMessage: 'Limit must be 1 or more',
      options: isANaturalNumber
    }
  }
};
