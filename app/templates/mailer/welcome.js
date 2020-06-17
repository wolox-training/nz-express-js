exports.welcomeEmail = {
  subject: 'Welcome to Weets!',
  body: ({ firstName, email }) => `Dear ${firstName},

  Thanks for making an account in Weets!, to log in the application send a post request to:
  /users/sessions with the following body:
    {
      email: "${email}",
      password: _your_password
    }
  This will generate a JWT token to use as a Bearer Authorization header

  Thank you for joining!
  `
};
