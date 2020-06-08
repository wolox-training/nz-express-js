const request = require('supertest');
const axios = require('axios');

const { factory } = require('factory-girl');
const { factoryByModel } = require('../factory/factory_by_models');
const { numberMockBodies } = require('../mock/number');
const app = require('../../app');
const Weet = require('../../app/models').weet;
const User = require('../../app/models').user;

jest.mock('axios');
describe('POST #createweet', () => {
  // eslint-disable-next-line init-declarations
  let jwtToken;
  factoryByModel('user');

  describe('with no authentication', () => {
    test('It returns an error', async done => {
      const response = await request(app).post('/weets');

      expect(response.statusCode).toEqual(401);
      expect(response.body).toHaveProperty('internal_code', 'unauthorized');
      expect(response.body).toHaveProperty('message', 'Unauthorized');
      done();
    });
  });

  describe('with authentication', () => {
    beforeEach(async done => {
      const userAttributes = await factory.attrs('user');

      await request(app)
        .post('/users')
        .send({
          ...userAttributes,
          email: 'normal_user@wolox.com.ar',
          password: 'validpassword12345678'
        });

      const loginRequest = await request(app)
        .post('/users/sessions')
        .send({
          email: 'normal_user@wolox.com.ar',
          password: 'validpassword12345678'
        });

      jwtToken = loginRequest.body.token;
      done();
    });

    test('with a normal number fact, it creates a weet', async done => {
      axios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: numberMockBodies.normalFact
        })
      );

      const response = await request(app)
        .post('/weets')
        .set('Authorization', `Bearer ${jwtToken}`);

      const createdWeet = await Weet.findOne();
      const author = await User.findOne({
        where: {
          email: 'normal_user@wolox.com.ar'
        }
      });

      expect(response.statusCode).toEqual(201);
      expect(createdWeet.content).toEqual(numberMockBodies.normalFact);
      expect(createdWeet.userId).toEqual(author.id);
      done();
    });

    test('with a long number fact, it returns an error', async done => {
      axios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: numberMockBodies.longFact
        })
      );

      const response = await request(app)
        .post('/weets')
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.statusCode).toEqual(400);
      expect(response.body).toHaveProperty('internal_code', 'model_validation_error');
      expect(response.body).toHaveProperty('message', 'Weet is too long');
      done();
    });
  });
});

describe('GET #indexWeet', () => {
  // eslint-disable-next-line init-declarations
  let jwtToken;
  factoryByModel('weet');

  describe('with no authentication', () => {
    test('It returns an error', async done => {
      const response = await request(app).get('/weets');

      expect(response.statusCode).toEqual(401);
      expect(response.body).toHaveProperty('internal_code', 'unauthorized');
      expect(response.body).toHaveProperty('message', 'Unauthorized');
      done();
    });
  });

  describe('with authentication', () => {
    beforeEach(async done => {
      const userAttributes = await factory.attrs('user');
      const weetAtrtibutes = await factory.attrs('weet');

      await request(app)
        .post('/users')
        .send({
          ...userAttributes,
          email: 'normal_user@wolox.com.ar',
          password: 'validpassword12345678'
        });

      const loginRequest = await request(app)
        .post('/users/sessions')
        .send({
          email: 'normal_user@wolox.com.ar',
          password: 'validpassword12345678'
        });

      jwtToken = loginRequest.body.token;

      Weet.bulkCreate(Array(5).fill({ ...weetAtrtibutes, userId: 1 }));

      done();
    });
  });

  test('With valid params, it returns a page', async done => {
    const response = await request(app)
      .get('/weets')
      .query({ limit: 1, page: 1 })
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('data', [
      { 'admin?': false, email: 'foo@wolox.com.ar', firstName: 'Foo', id: 2, lastName: 'Bar' }
    ]);
    expect(response.body).toHaveProperty('page', 2);
    expect(response.body).toHaveProperty('totalElements', 2);
    expect(response.body).toHaveProperty('totalPages', 2);
    done();
  });
});
