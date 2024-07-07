// eslint-disable-next-line import/no-extraneous-dependencies
import 'dotenv/config';
import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  moduleNameMapper: {
    '^@types/(.*)$': 'types/$1',
    '^@queries/(.*)$': 'queries/$1',
    '^@dto/(.*)$': 'dto/$1',
    '^@utilities/(.*)$': 'utilities/$1',
    '^@libraries/(.*)$': 'libraries/$1',
    '^@validators/(.*)$': 'validators/$1',
  },
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  rootDir: '.',
  extensionsToTreatAsEsm: ['.ts'],
  moduleDirectories: ['node_modules', 'src'],
  transformIgnorePatterns: ['node_modules/'],
};

export default config;
