module.exports = {
  clearMocks: true,
  collectCoverage: process.env.COVERAGE === 'true',
  collectCoverageFrom: ['src/**/*.ts'],
  coverageProvider: 'babel',
  testEnvironment: 'jsdom',
  testRunner: 'jest-circus/runner',
  cacheDirectory: '.jest/cache',
};
