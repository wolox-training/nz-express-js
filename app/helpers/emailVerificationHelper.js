module.exports = email => {
  const re = /\S+@wolox.\S+/;
  return re.test(email);
};
