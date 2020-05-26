const { emailSchema } = require('./session');

const passwordSchema = {
  exists: {
    errorMessage: 'Password must be present'
  },
  isLength: {
    errorMessage: 'Password must be at least 6 characters long',
    options: { min: 6 }
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
