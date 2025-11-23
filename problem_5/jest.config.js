/** @type {import('ts-jest').JestConfigWithTsJest} */
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Module path mapping for TypeScript aliases
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src/' }),

  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/tests/unit/**/*.test.ts',
    '**/tests/e2e/**/*.test.ts',
  ],
  testTimeout: 10000, // 10 seconds for E2E tests

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/app.ts',
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,
};
