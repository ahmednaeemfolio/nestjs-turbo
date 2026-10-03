const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

let testEnvironment = 'node';
try {
  require.resolve('jest-environment-jsdom');
  testEnvironment = 'jsdom';
} catch {
  // The repository may not have relinked newly declared dependencies yet.
}

const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment,
};

module.exports = createJestConfig(config);
