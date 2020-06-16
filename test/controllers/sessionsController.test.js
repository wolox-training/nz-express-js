/* eslint-disable init-declarations */
/* eslint-disable no-unused-vars */
const request = require('supertest');
const { factory } = require('factory-girl');
const { factoryByModel } = require('../factory/factory_by_models');
const app = require('../../app');

describe('POST #signin', () => {
  factoryByModel('user');
  beforeEach(async done => {
    const userAttributes = await factory.attrs('user');

    await request(app)
      .post('/users')
      .send({
        ...userAttributes,
        email: 'test@wolox.com.ar',
        password: '12345678'
      });
    done();
  });

  test('With valid params, it returns a JWT token', async done => {
    const response = await request(app)
      .post('/users/sessions')
      .send({
        email: 'test@wolox.com.ar',
        password: '12345678'
      });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('token');
    done();
  });

  test('With a non wolox email, it returns an Error', async done => {
    const response = await request(app)
      .post('/users/sessions')
      .send({
        email: 'test@test.com.ar',
        password: '12345678'
      });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toHaveProperty('internal_code', 'model_validation_error');
    expect(response.body).toHaveProperty('message', 'Email must be from the Wolox domain');
    done();
  });

  test('With an empty required param, it returns an Error', async done => {
    const response = await request(app)
      .post('/users/sessions')
      .send({
        password: '12345678'
      });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toHaveProperty('internal_code', 'model_validation_error');
    expect(response.body).toHaveProperty(
      'message',
      'Email must be present; Email must be from the Wolox domain'
    );
    done();
  });

  test('When the email does not match any existing Users, it returns an Error', async done => {
    const response = await request(app)
      .post('/users/sessions')
      .send({
        email: 'test1@wolox.com.ar',
        password: '12345678'
      });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toHaveProperty('internal_code', 'password_or_email_incorrect');
    expect(response.body).toHaveProperty('message', 'User not found');
    done();
  });

  test('When the password is incorrect, it returns an Error', async done => {
    const response = await request(app)
      .post('/users/sessions')
      .send({
        email: 'test@wolox.com.ar',
        password: 'abcdefgh'
      });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toHaveProperty('internal_code', 'password_or_email_incorrect');
    expect(response.body).toHaveProperty('message', 'Password not match');
    done();
  });
});

describe('POST #invalidate_all', () => {
  factoryByModel('user');
  describe('with no authentication', () => {
    test('It returns an error', async done => {
      const response = await request(app).post('/users/sessions/invalidate_all');

      expect(response.statusCode).toEqual(401);
      expect(response.body).toHaveProperty('internal_code', 'unauthorized');
      expect(response.body).toHaveProperty('message', 'Unauthorized');
      done();
    });
  });

  describe('with authentication', () => {
    let jwtToken;

    beforeEach(async done => {
      const userAttributes = await factory.attrs('user');

      await request(app)
        .post('/users')
        .send({
          ...userAttributes,
          email: 'login_user@wolox.com.ar',
          password: 'validpassword12345678'
        });

      const loginRequest = await request(app)
        .post('/users/sessions')
        .send({
          email: 'login_user@wolox.com.ar',
          password: 'validpassword12345678'
        });

      jwtToken = loginRequest.body.token;
      done();
    });

    test('when invalidating all user token, the user must login again to use the auth endpoints', async () => {
      const invalidateRequest = await request(app)
        .post('/users/sessions/invalidate_all')
        .send({
          email: 'login_user@wolox.com.ar',
          password: 'validpassword12345678'
        })
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(invalidateRequest.statusCode).toEqual(200);

      const authRequiredRequest = await request(app)
        .post('/users/sessions/invalidate_all')
        .send({
          email: 'login_user@wolox.com.ar',
          password: 'validpassword12345678'
        })
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(authRequiredRequest.statusCode).toEqual(401);
      expect(authRequiredRequest.body).toHaveProperty('internal_code', 'unauthorized');
      expect(authRequiredRequest.body).toHaveProperty('message', 'Unauthorized');
    });
  });
});
