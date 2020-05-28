exports.userSerializer = user => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  'admin?': user.admin
});
