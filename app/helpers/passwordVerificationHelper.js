module.exports = password => {
  const letterNumber = /^[0-9a-zA-Z]+$/;
  return password.length > 6 && letterNumber.test(password);
};
