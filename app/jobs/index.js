const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);

module.exports = () => {
  fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .forEach(file => {
      // eslint-disable-next-line global-require
      const { cronJob } = require(`./${file}`);
      cronJob.start();
    });
};
