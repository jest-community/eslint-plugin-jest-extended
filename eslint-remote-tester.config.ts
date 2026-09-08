import typescriptEslintParser from '@typescript-eslint/parser';
import jestExtended from 'eslint-plugin-jest-extended';
import type { Config } from 'eslint-remote-tester';
import {
  getPathIgnorePattern,
  getRepositories,
} from 'eslint-remote-tester-repositories';

const config: Config = {
  repositories: getRepositories({ randomize: true }),
  pathIgnorePattern: getPathIgnorePattern(),
  extensions: ['js', 'jsx', 'ts', 'tsx'],
  concurrentTasks: 3,
  cache: false,
  logLevel: 'info',
  eslintConfig: [
    jestExtended.configs['flat/all'],
    {
      languageOptions: {
        parser: typescriptEslintParser,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
  ],
};

export default config;
