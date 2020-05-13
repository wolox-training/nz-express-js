const bcrypt = require('bcrypt');

module.exports = body => {
  const { password } = body;
  const saltRounds = 10;

  const hashedPassword = new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) reject(err);
      resolve({ ...body, password: hash });
    });
  });

  return hashedPassword;
};
