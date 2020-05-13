const { modelValidationError } = require('../errors');

const emailValidator = email => {
  const re = /\S+@wolox.\S+/;
  return re.test(email);
};

const passwordValidator = password => {
  const letterNumber = /^[0-9a-zA-Z]+$/;
  return password.length > 6 && letterNumber.test(password);
};

module.exports = body =>
  new Promise((resolve, reject) => {
    if (emailValidator(body.email) && passwordValidator(body.password)) {
      resolve(body);
    }
    reject(modelValidationError('Invalid user fields'));
  });
