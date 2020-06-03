const request = require('supertest');
const mockery = require('mockery');
const { factory } = require('factory-girl');
const { numberMock } = require('../mock/number');
const { factoryByModel } = require('../factory/factory_by_models');
const app = require('../../app');
// const User = require('../../app/models').user;

describe('POST #signup', () => {
  // eslint-disable-next-line init-declarations
  let jwtToken;
  beforeEach(async done => {
    factoryByModel('user');
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
    mockery.enable();
    done();
  });

  afterEach(() => {
    mockery.disable();
  });

  test('testing the mock', async done => {
    mockery.registerMock('../services/number', numberMock.normalFact);

    const loginRequest = await request(app)
      .post('/users/sessions')
      .send({
        email: 'normal_user@wolox.com.ar',
        password: 'validpassword12345678'
      });

    jwtToken = loginRequest.body.token;

    const response = await request(app)
      .post('/weets')
      .set('Authorization', `Bearer ${jwtToken}`);

    console.log(response);
    expect(response.statusCode).toEqual(201);
    done();
  });
});
