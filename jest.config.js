/** @type {import('jest').Config} */
module.exports = {
  // Use ts-jest to handle TypeScript + JSX
  preset: 'ts-jest',

  // Use jsdom for React component testing
  testEnvironment: 'jsdom',

  // File types Jest should handle
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Map module aliases and mock CSS modules
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },

  // Setup file for testing-library, jest-dom, fetch polyfill, localStorage mocks, etc.
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Ignore node_modules from transformation (except ts-jest will handle TS files)
  transformIgnorePatterns: ['/node_modules/'],
};
