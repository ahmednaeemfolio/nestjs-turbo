const path = require('node:path');

const swcJest = require.resolve('@swc/jest', {
  paths: [path.join(__dirname, '../realworld-api')],
});

module.exports = {
  rootDir: __dirname,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/app/**/*.test.ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.[jt]sx?$': [
      swcJest,
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
        module: {
          type: 'commonjs',
        },
      },
    ],
  },
  moduleNameMapper: {
    '^.+\\.module\\.css$': '<rootDir>/jest.setup.ts',
  },
};
