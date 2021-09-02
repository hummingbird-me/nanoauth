module.exports = {
  clearMocks: true,
  collectCoverage: process.env.COVERAGE === 'true',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  testRunner: 'jest-circus/runner',
  cacheDirectory: '.jest/cache',
};
