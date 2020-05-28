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

describe('GET #index', () => {
  describe('with no authentication', () => {
    test('It returns an error', async done => {
      const response = await request(app).get('/users');

      expect(response.statusCode).toEqual(401);
      expect(response.body).toHaveProperty('internal_code', 'unauthorized');
      expect(response.body).toHaveProperty('message', 'Unauthorized');
      done();
    });
  });

  describe('with authentication', () => {
    // eslint-disable-next-line init-declarations
    let jwtToken;

    beforeEach(async done => {
      await request(app)
        .post('/users')
        .send({
          firstName: 'Test',
          lastName: 'McTesting',
          email: 'test@wolox.com.ar',
          password: '12345678'
        });
      await request(app)
        .post('/users')
        .send({
          firstName: 'Foo',
          lastName: 'Bar',
          email: 'foo@wolox.com.ar',
          password: '12345678'
        });
      const loginRequest = await request(app)
        .post('/users/sessions')
        .send({
          email: 'test@wolox.com.ar',
          password: '12345678'
        });
      jwtToken = loginRequest.body.token;
      done();
    });

    test('when asking for the first page, with default limit, it returns the page', async done => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('data', [
        { 'admin?': false, email: 'test@wolox.com.ar', firstName: 'Test', id: 1, lastName: 'McTesting' },
        { 'admin?': false, email: 'foo@wolox.com.ar', firstName: 'Foo', id: 2, lastName: 'Bar' }
      ]);
      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('totalElements', 2);
      expect(response.body).toHaveProperty('totalPages', 1);
      done();
    });

    test('when asking for the first page, with custom limit, it returns the first page', async done => {
      const response = await request(app)
        .get('/users')
        .query({ limit: '1' })
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('data', [
        { 'admin?': false, email: 'test@wolox.com.ar', firstName: 'Test', id: 1, lastName: 'McTesting' }
      ]);
      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('totalElements', 2);
      expect(response.body).toHaveProperty('totalPages', 2);
      done();
    });

    test('when asking for the second page, with custom limit, it returns the second page', async done => {
      const response = await request(app)
        .get('/users')
        .query({ limit: 1, page: 2 })
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

    test('when asking for the third page, with custom limit, it returns an empty page', async done => {
      const response = await request(app)
        .get('/users')
        .query({ limit: 1, page: 3 })
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('data', []);
      expect(response.body).toHaveProperty('page', 3);
      expect(response.body).toHaveProperty('totalElements', 2);
      expect(response.body).toHaveProperty('totalPages', 2);
      done();
    });
  });
});
