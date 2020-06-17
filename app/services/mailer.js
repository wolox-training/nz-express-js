const nodemailer = require('nodemailer');

const logger = require('../logger');

const NOREPLY_FROM = '"Weets App" <no-reply@weets.wolox.com>';

const {
  mailer: { host, port, auth }
} = require('../../config').common;

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: false,
  auth
});

exports.sendPlainEmail = async (receivers, subject, body) => {
  const info = await transporter.sendMail({
    from: NOREPLY_FROM,
    to: receivers.join(', '),
    subject,
    text: body
  });

  logger.info('Message sent: ', info.messageId);
  logger.info('Preview URL: ', nodemailer.getTestMessageUrl(info));
};
