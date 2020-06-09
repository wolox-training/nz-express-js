const passwordSchema = {
  exists: {
    errorMessage: 'Password must be present'
  },
  isLength: {
    errorMessage: 'Password must be at least 6 characters long',
    options: { min: 6 }
  }
};

const emailSchema = {
  exists: {
    errorMessage: 'Email must be present'
  },
  matches: {
    errorMessage: 'Email must be from the Wolox domain',
    options: /\S+@wolox.\S+/
  }
};

exports.userSchema = {
  email: emailSchema,
  password: passwordSchema,
  firstName: {
    exists: {
      errorMessage: 'First name must be present'
    }
  },
  lastName: {
    exists: {
      errorMessage: 'Last name must be present'
    }
  }
};
