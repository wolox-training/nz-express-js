const request = require('supertest');

const { factoryByModel } = require('../factory/factory_by_models');
const app = require('../../app');

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
});
