const request = require('supertest');
const { factory } = require('factory-girl');

const { factoryByModel } = require('../factory/factory_by_models');
const { findUserByEmail } = require('../../app/services/user');
const app = require('../../app');
const Weet = require('../../app/models').weet;
const Rating = require('../../app/models').rating;

describe('POST #createRating', () => {
  factoryByModel('user');
  factoryByModel('weet');

  describe('with no authentication', () => {
    test('It returns an error', async done => {
      const response = await request(app).post('/weets/1/ratings');

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
      const userAttributes = await factory.attrs('user');
      const weetAtrtibutes = await factory.attrs('weet');

      await request(app)
        .post('/users')
        .send({
          ...userAttributes,
          email: 'weet_creator@wolox.com.ar',
          password: 'validpassword12345678'
        });

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

      const userId = await findUserByEmail('weet_creator@wolox.com.ar').then(user => user.id);
      Weet.bulkCreate(Array(5).fill({ ...weetAtrtibutes, userId }));

      done();
    });

    test('with an empty score, it returns an error', async done => {
      const response = await request(app)
        .post('/weets/1/ratings')
        .send({})
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.statusCode).toEqual(400);
      expect(response.body).toHaveProperty('internal_code', 'model_validation_error');
      expect(response.body).toHaveProperty(
        'message',
        'Score must be present; Invalid score, the score must be either 1 or -1'
      );
      done();
    });

    test('with an invalid score, it returns an error', async done => {
      const response = await request(app)
        .post('/weets/1/ratings')
        .send({ score: 0 })
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.statusCode).toEqual(400);
      expect(response.body).toHaveProperty('internal_code', 'model_validation_error');
      expect(response.body).toHaveProperty('message', 'Invalid score, the score must be either 1 or -1');
      done();
    });

    test('with an invalid weet id, it returns an error', async done => {
      const response = await request(app)
        .post('/weets/500/ratings')
        .send({ score: 1 })
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.statusCode).toEqual(404);
      expect(response.body).toHaveProperty('internal_code', 'weet_not_found');
      expect(response.body).toHaveProperty('message', 'Weet not found');
      done();
    });

    test('with a valid rating body, it creates a rating an update the weets author points', async done => {
      const response = await request(app)
        .post('/weets/1/ratings')
        .send({ score: 1 })
        .set('Authorization', `Bearer ${jwtToken}`);

      const userId = await findUserByEmail('login_user@wolox.com.ar').then(user => user.id);

      const createdRating = await Rating.findAll({
        where: {
          weetId: 1,
          ratingUserId: userId
        }
      });

      const author = await findUserByEmail('weet_creator@wolox.com.ar');

      expect(response.statusCode).toEqual(200);

      expect(createdRating.length).toEqual(1);
      expect(createdRating[0].score).toEqual(1);
      expect(author.points).toEqual(1);
      done();
    });

    test('with a valid rating, if the rating exist, it updates the author score and the weets author points', async done => {
      const author = await findUserByEmail('weet_creator@wolox.com.ar');

      await request(app)
        .post('/weets/1/ratings')
        .send({ score: 1 })
        .set('Authorization', `Bearer ${jwtToken}`);

      const response = await request(app)
        .post('/weets/1/ratings')
        .send({ score: -1 })
        .set('Authorization', `Bearer ${jwtToken}`);

      const userId = await findUserByEmail('login_user@wolox.com.ar').then(user => user.id);

      const createdRating = await Rating.findAll({
        where: {
          weetId: 1,
          ratingUserId: userId
        }
      });

      expect(response.statusCode).toEqual(200);

      expect(createdRating.length).toEqual(1);
      expect(createdRating[0].score).toEqual(-1);
      expect(author.points).toEqual(0);
      done();
    });

    test('if a weet gets downvoted by the same user, it only afects the user ones ', async done => {
      await request(app)
        .post('/weets/1/ratings')
        .send({ score: -1 })
        .set('Authorization', `Bearer ${jwtToken}`);

      await request(app)
        .post('/weets/1/ratings')
        .send({ score: -1 })
        .set('Authorization', `Bearer ${jwtToken}`);

      await request(app)
        .post('/weets/1/ratings')
        .send({ score: -1 })
        .set('Authorization', `Bearer ${jwtToken}`);

      await request(app)
        .post('/weets/1/ratings')
        .send({ score: -1 })
        .set('Authorization', `Bearer ${jwtToken}`);

      const userId = await findUserByEmail('login_user@wolox.com.ar').then(user => user.id);
      const author = await findUserByEmail('weet_creator@wolox.com.ar');

      const createdRating = await Rating.findAll({
        where: {
          weetId: 1,
          ratingUserId: userId
        }
      });

      expect(createdRating.length).toEqual(1);
      expect(createdRating[0].score).toEqual(-1);
      expect(author.points).toEqual(-1);
      done();
    });
  });
});
