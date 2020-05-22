exports.passwordSchema = {
  exists: {
    errorMessage: 'Password must be present'
  },
  isLength: {
    errorMessage: 'Password must be at least 6 characters long',
    options: { min: 6 }
  }
};

exports.emailSchema = {
  exists: {
    errorMessage: 'Email must be present'
  },
  matches: {
    errorMessage: 'Email must be from the Wolox domain',
    options: /\S+@wolox.\S+/
  }
};
