'use strict';

const eslintCommentsConfigs = require('@eslint-community/eslint-plugin-eslint-comments/configs');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptEslintParser = require('@typescript-eslint/parser');
const { defineConfig, globalIgnores } = require('eslint/config');
const { default: eslintPluginPlugin } = require('eslint-plugin-eslint-plugin');
const importX = require('eslint-plugin-import-x');
const nPlugin = require('eslint-plugin-n');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  globalIgnores(['coverage/', 'lib/', '.yarn/']),
  {
    files: ['**/*.{js,ts}'],
    extends: [
      eslintPluginPlugin.configs.recommended,
      eslintCommentsConfigs.recommended,
      nPlugin.configs['flat/recommended'],
      typescriptEslintPlugin.configs['flat/eslint-recommended'],
      prettierRecommended,
    ],
    plugins: {
      'import-x': importX,
      '@typescript-eslint': typescriptEslintPlugin,
    },
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    rules: {
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { disallowTypeAnnotations: false, fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@eslint-community/eslint-comments/no-unused-disable': 'error',
      'eslint-plugin/require-meta-docs-description': [
        'error',
        { pattern: '^(Enforce|Require|Disallow|Suggest|Prefer)' },
      ],
      'eslint-plugin/test-case-property-ordering': 'error',
      'no-else-return': 'error',
      'no-negated-condition': 'error',
      eqeqeq: ['error', 'smart'],
      strict: 'error',
      'prefer-template': 'error',
      'object-shorthand': [
        'error',
        'always',
        { avoidExplicitReturnArrows: true },
      ],
      'prefer-destructuring': [
        'error',
        { VariableDeclarator: { array: true, object: true } },
      ],
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      'require-unicode-regexp': 'error',
      // TS covers these 2
      'n/no-missing-import': 'off',
      'n/no-missing-require': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
      'n/no-unsupported-features/es-builtins': 'error',
      'import-x/no-commonjs': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/no-extraneous-dependencies': 'error',
      'import-x/order': [
        'error',
        { alphabetize: { order: 'asc' }, 'newlines-between': 'never' },
      ],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
        { blankLine: 'always', prev: 'directive', next: '*' },
        { blankLine: 'any', prev: 'directive', next: 'directive' },
      ],

      'prefer-spread': 'error',
      'prefer-rest-params': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-var': 'error',
      curly: 'error',
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'import-x/no-commonjs': 'off',
    },
  },
]);
