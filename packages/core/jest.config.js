// packages/core/jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/tests/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/tests/__mocks__/fileMock.js',
  },
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  // Floor set just under the measured baseline (2026-07-14: ~46% lines) so it
  // catches regressions without blocking today's suite. Ratchet up as
  // coverage improves — don't lower it to make a failing run pass.
  coverageThreshold: {
    global: {
      statements: 40,
      branches: 25,
      functions: 35,
      lines: 40,
    },
  },
};
