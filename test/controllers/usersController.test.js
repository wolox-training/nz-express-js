const request = require('supertest');
const app = require('../../app');
const User = require('../../app/models').user;

describe('POST #signup', () => {
  test('With valid params, it creates a User', async done => {
    const response = await request(app)
      .post('/users')
      .send({
        firstName: 'Test',
        lastName: 'McTesting',
        email: 'test@wolox.com.ar',
        password: '12345678'
      });
    expect(response.statusCode).toEqual(201);
    expect(response.body).toHaveProperty('id');
    done();
  });

  test('With a non wolox email, it returns an Error', async done => {
    const response = await request(app)
      .post('/users')
      .send({
        firstName: 'Test',
        lastName: 'McTesting',
        email: 'test@test.com.ar',
        password: '12345678'
      });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toHaveProperty('internal_code', 'model_validation_error');
    expect(response.body).toHaveProperty('message', 'Email must be from the Wolox domain');
    done();
  });

  test('With a weak password, it returns an Error', async done => {
    const response = await request(app)
      .post('/users')
      .send({
        firstName: 'Test',
        lastName: 'McTesting',
        email: 'test@wolox.com.ar',
        password: '123'
      });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toHaveProperty('internal_code', 'model_validation_error');
    expect(response.body).toHaveProperty('message', 'Password must be at least 6 characters long');
    done();
  });

  test('With an empty required param, it returns an Error', async done => {
    const response = await request(app)
      .post('/users')
      .send({
        firstName: 'Test',
        lastName: 'McTesting',
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

  test('With an existing email, it returns an Error', async done => {
    User.create({
      firstName: 'Test',
      lastName: 'McTesting',
      email: 'test@wolox.com.ar',
      password: '12345678'
    });

    const response = await request(app)
      .post('/users')
      .send({
        firstName: 'Test Jr',
        lastName: 'McTesting',
        email: 'test@wolox.com.ar',
        password: '12345678'
      });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toHaveProperty('internal_code', 'email_already_in_use');
    expect(response.body).toHaveProperty('message', 'Email already in use');
    done();
  });
});
