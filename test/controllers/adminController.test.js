const request = require('supertest');
const { factory } = require('factory-girl');
const { factoryByModel } = require('../factory/factory_by_models');
const { findUserByEmail, updateToAdminUser } = require('../../app/services/user');
const { userSerializer } = require('../../app/serializers/user');
const User = require('../../app/models').user;

const app = require('../../app');

describe('#POST createAdminUser', () => {
  describe('With no authentication', () => {
    test('It returns an error', async done => {
      factoryByModel('user');
      const userAttributes = await factory.attrs('user');

      const response = await request(app)
        .post('/admin/users')
        .send({
          ...userAttributes,
          email: 'validwoloxemail@wolox.com.ar',
          password: 'validpassword12345678'
        });

      expect(response.statusCode).toEqual(401);
      expect(response.body).toHaveProperty('internal_code', 'unauthorized');
      expect(response.body).toHaveProperty('message', 'Unauthorized');
      done();
    });
  });

  describe('With authentication', () => {
    // eslint-disable-next-line init-declarations
    let jwtToken;

    beforeEach(async done => {
      const userAttributes = await factory.attrs('user');

      await request(app)
        .post('/users')
        .send({
          ...userAttributes,
          logoutTime: null,
          email: 'admin@wolox.com.ar',
          password: 'validpassword12345678'
        });

      await request(app)
        .post('/users')
        .send({
          ...userAttributes,
          logoutTime: null,
          email: 'notadmin@wolox.com.ar',
          password: 'validpassword12345678'
        });

      await findUserByEmail('admin@wolox.com.ar').then(user => updateToAdminUser(user));

      const adminLoginRequest = await request(app)
        .post('/users/sessions')
        .send({
          email: 'admin@wolox.com.ar',
          password: 'validpassword12345678'
        });

      jwtToken = adminLoginRequest.body.token;
      done();
    });

    test('when the authenticate user is not an admin, it returns an error', async done => {
      const userAttributes = await factory.attrs('user');

      const loginRequest = await request(app)
        .post('/users/sessions')
        .send({
          email: 'notadmin@wolox.com.ar',
          password: 'validpassword12345678'
        });

      jwtToken = loginRequest.body.token;

      const response = await request(app)
        .post('/admin/users')
        .send({
          ...userAttributes,
          email: 'validwoloxemail@wolox.com.ar',
          password: 'validpassword12345678'
        })
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.statusCode).toEqual(401);
      expect(response.body).toHaveProperty('internal_code', 'unauthorized');
      expect(response.body).toHaveProperty('message', 'Unauthorized');
      done();
    });

    test('when the authenticate user is an admin but the email is wrong, it returns an error', async done => {
      const userAttributes = await factory.attrs('user');

      const response = await request(app)
        .post('/admin/users')
        .send({
          ...userAttributes,
          email: 'notavalidemail@molox.com.ar',
          password: 'validpassword12345678'
        })
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.statusCode).toEqual(400);
      expect(response.body).toHaveProperty('internal_code', 'model_validation_error');
      expect(response.body).toHaveProperty('message', 'Email must be from the Wolox domain');
      done();
    });

    test('when the authenticate user is an admin but the password is wrong, it returns an error', async done => {
      const userAttributes = await factory.attrs('user');

      const response = await request(app)
        .post('/admin/users')
        .send({
          ...userAttributes,
          email: 'validemail@wolox.com.ar',
          password: 'week'
        })
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.statusCode).toEqual(400);
      expect(response.body).toHaveProperty('internal_code', 'model_validation_error');
      expect(response.body).toHaveProperty('message', 'Password must be at least 6 characters long');
      done();
    });

    test('when the authenticate user is an admin but a required param is missing, it returns an error', async done => {
      const userAttributes = await factory.attrs('user');

      delete userAttributes.firstName;

      const response = await request(app)
        .post('/admin/users')
        .send({
          ...userAttributes,
          email: 'validemail@wolox.com.ar',
          password: 'strongpassword'
        })
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.statusCode).toEqual(400);
      expect(response.body).toHaveProperty('internal_code', 'model_validation_error');
      expect(response.body).toHaveProperty('message', 'First name must be present');
      done();
    });

    test('when the authenticate user is an admin, all the params are good and is a new user, it creates a new admin user', async done => {
      const userAttributes = await factory.attrs('user');

      const response = await request(app)
        .post('/admin/users')
        .send({
          ...userAttributes,
          email: 'admin2@wolox.com.ar',
          password: 'strongpassword'
        })
        .set('Authorization', `Bearer ${jwtToken}`);

      const savedUser = await findUserByEmail('admin2@wolox.com.ar');
      const numberOfUsers = await User.count();

      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual(userSerializer(savedUser));
      expect(savedUser.admin).toEqual(true);
      expect(numberOfUsers).toEqual(3);
      done();
    });

    test('when the authenticate user is an admin, all the params are good and is an existing user, it only updates the existing user with admin priviliges', async done => {
      const userAttributes = await factory.attrs('user');

      const response = await request(app)
        .post('/admin/users')
        .send({
          ...userAttributes,
          email: 'notadmin@wolox.com.ar',
          password: 'validpassword12345678'
        })
        .set('Authorization', `Bearer ${jwtToken}`);

      const updatedUser = await findUserByEmail('notadmin@wolox.com.ar');
      const numberOfUsers = await User.count();

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(userSerializer(updatedUser));
      expect(updatedUser.admin).toEqual(true);
      expect(numberOfUsers).toEqual(2);
      done();
    });
  });
});
