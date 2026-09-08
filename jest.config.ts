import type { Config } from 'jest';

const config = {
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,

  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },

  testPathIgnorePatterns: [
    '<rootDir>/lib/.*',
    '<rootDir>/src/rules/__tests__/test-utils.ts',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
} satisfies Config;

export default config;
