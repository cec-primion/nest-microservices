const baseConfig = require('./jest.base.config');

module.exports = Object.assign(baseConfig, {
  testRegex: '.*\\.spec\\.ts$',
});
