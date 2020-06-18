const { factory } = require('factory-girl');

const User = require('../../app/models').user;
const Weet = require('../../app/models').weet;

const { sendPlainEmail } = require('../../app/services/mailer');
const { congratulationsEmail } = require('../../app/templates/mailer/congratulations');
const { factoryByModel } = require('../factory/factory_by_models');

const { job } = require('../../app/jobs/congratulateMostWordsWeets');

jest.mock('../../app/services/mailer');
describe('#sendCongratulationsEmail', () => {
  factoryByModel('user');
  test('It sends a congratulations email to the most words weet user', async done => {
    sendPlainEmail.mockImplementationOnce(() => null);

    const userAttributes = await factory.attrs('user');

    await User.bulkCreate([
      {
        ...userAttributes,
        id: 1,
        logoutTime: null,
        email: 'best_user@wolox.com.ar',
        password: 'validpassword12345678'
      },
      {
        ...userAttributes,
        id: 2,
        logoutTime: null,
        email: 'not_the_best_user@wolox.com.ar',
        password: 'validpassword12345678'
      }
    ]);

    const bestUser = await User.findOne({
      where: {
        email: 'best_user@wolox.com.ar'
      }
    });

    await Weet.bulkCreate([
      {
        content: 'This is the weet with most words ever!',
        userId: 1
      },
      {
        content: 'This is not',
        userId: 2
      }
    ]);

    await job();

    expect(sendPlainEmail.mock.calls.length).toBe(1);
    expect(sendPlainEmail.mock.calls[0]).toEqual([
      ['best_user@wolox.com.ar'],
      congratulationsEmail.subject,
      congratulationsEmail.body(bestUser)
    ]);
    done();
  });
});
