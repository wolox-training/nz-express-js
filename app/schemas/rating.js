exports.ratingSchema = {
  score: {
    exists: {
      errorMessage: 'Score must be present'
    },
    isIn: {
      options: [[1, -1]],
      errorMessage: 'Invalid score, the score must be either 1 or -1'
    }
  }
};
