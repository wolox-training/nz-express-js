exports.config = {
  environment: 'testing',
  isTesting: true,
  common: {
    database: {
      name: process.env.DB_NAME_TEST
    },

    session: {
      secret: 'some-super-secret'
    },

    mailer: {
      host: 'smtp.mailtrap.io',
      port: 42069,
      auth: {
        user: 'user',
        pass: 'pass'
      }
    }
  }
};
