exports.congratulationsEmail = {
  subject: 'Congratulations on being the wordest buddy!',
  body: ({ firstName }) => `Dear ${firstName},

  You have weeted the most words in the platform!
  Mr Tower would be so proud

  Thanks!
  `
};
