/**
 * Documentation-only Jest config for apps/web.
 *
 * This repo's CI does not execute Jest for the web app (see task constraint C-3),
 * but we keep this file to document intended Testing Library usage.
 */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
