import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};

export default config;
