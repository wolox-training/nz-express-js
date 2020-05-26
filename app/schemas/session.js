const emailSchema = {
  exists: {
    errorMessage: 'Email must be present'
  },
  matches: {
    errorMessage: 'Email must be from the Wolox domain',
    options: /\S+@wolox.\S+/
  }
};

const sessionSchema = {
  email: emailSchema,
  password: {
    exists: {
      errorMessage: 'Password must be present'
    }
  }
};

module.exports = {
  emailSchema,
  sessionSchema
};
