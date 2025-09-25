const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const reactNative = require('@react-native/eslint-plugin');
const pluginJest = require('eslint-plugin-jest');
const pluginPromise = require('eslint-plugin-promise');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const stylistic = require('@stylistic/eslint-plugin');

/**
 * eslint-config-expo
 *  - @typescript-eslint
 *    @see https://github.com/expo/expo/blob/main/packages/eslint-config-expo/flat/utils/typescript.js (8bbb697)
 *
 *  - eslint-plugin-react/recommended
 *    @see https://github.com/expo/expo/blob/main/packages/eslint-config-expo/flat/utils/react.js (d714c1d)
 *    @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/index.js#L39 (efc021f)
 *
 *  - eslint-plugin-react-hooks/recommended
 *    @see https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/src/index.ts#L27
 *
 * Additional plugins:
 *  - @react-native/eslint-plugin
 *    @see https://github.com/facebook/react-native/tree/main/packages/eslint-plugin-react-native
 *
 *  - @stylistic/eslint-plugin
 *    @see https://eslint.style
 *
 *  - jest/recommended
 *    @see https://github.com/jest-community/eslint-plugin-jest/blob/main/src/index.ts#L33
 *
 *  - simple-import-sort
 *    @see https://github.com/lydell/eslint-plugin-simple-import-sort
 */
module.exports = defineConfig([
  expoConfig,
  pluginJest.configs['flat/recommended'],
  pluginPromise.configs['flat/recommended'],
  {
    plugins: {
      '@react-native': reactNative,
      '@stylistic': stylistic,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      'react/display-name': 'off',

      '@typescript-eslint/consistent-indexed-object-style': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error', {
          'allowExpressions': true,
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          'selector': 'typeLike',
          'format': ['PascalCase'],
        },
        {
          'selector': 'enumMember',
          'format': ['UPPER_CASE'],
        },
        {
          'selector': [
            'method',
            'property',
          ],
          'format': ['camelCase'],
        },
        {
          'selector': 'classProperty',
          'modifiers': ['static'],
          'format': ['UPPER_CASE'],
          'filter': {
            'regex': '^defaultProps$',
            'match': false,
          },
        },
        {
          'selector': [
            'objectLiteralProperty',
            'objectLiteralMethod',
            'typeProperty',
          ],
          'format': null,
        },
        {
          'selector': 'parameter',
          'modifiers': ['unused'],
          'format': null,
          'leadingUnderscore': 'require',
        },
      ],

      '@typescript-eslint/explicit-member-accessibility': [
        'error', {
          'accessibility': 'explicit',
          'overrides': {
            'constructors': 'no-public',
          },
        },
      ],
      '@typescript-eslint/method-signature-style': ['error', 'method'],
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          'paths': [
            {
              'name': 'react',
              'importNames': ['default'],
              'message': 'Use named imports from React instead of default import. Example: import { useState } from "react";'
            }
          ]
        }
      ],
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/prefer-enum-initializers': 'error',

      '@stylistic/array-bracket-newline': [
        'error', {
          'multiline': true,
        },
      ],
      '@stylistic/array-element-newline': ['error', 'consistent'],
      '@stylistic/brace-style': 'error',
      '@stylistic/comma-dangle': [
        'error', {
          'arrays': 'always-multiline',
          'objects': 'always-multiline',
          'imports': 'always-multiline',
          'exports': 'always-multiline',
          'functions': 'always-multiline',
        },
      ],
      '@stylistic/comma-spacing': 'error',
      '@stylistic/function-paren-newline': ['error', 'multiline'],
      '@stylistic/jsx-quotes': ['error', 'prefer-single'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/key-spacing': 'error',
      '@stylistic/keyword-spacing': [
        'error', {
          'before': true,
        },
      ],
      '@stylistic/lines-between-class-members': [
        'error',
        'always',
        { 'exceptAfterSingleLine': true },
      ],
      '@stylistic/member-delimiter-style': 'error',
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/no-multiple-empty-lines': [
        'error', {
          'max': 1,
          'maxBOF': 0,
          'maxEOF': 1,
        },
      ],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/padding-line-between-statements': [
        'error',
        {
          'blankLine': 'always',
          'prev': 'import',
          'next': '*',
        },
        {
          'blankLine': 'any',
          'prev': 'import',
          'next': 'import',
        },
        {
          'blankLine': 'always',
          'prev': [
            'type',
            'interface',
          ],
          'next': '*',
        },
        {
          'blankLine': 'always',
          'prev': [
            'case',
            'default',
          ],
          'next': '*',
        },
        {
          'blankLine': 'always',
          'prev': '*',
          'next': [
            'return',
            'throw',
          ],
        },
      ],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-in-parens': ['error', 'never'],
      '@stylistic/space-unary-ops': 'error',
      '@stylistic/type-annotation-spacing': 'error',
      "@stylistic/quotes": ["error", "single"],

      'react/function-component-definition': [
        'error', {
          'namedComponents': 'arrow-function',
          'unnamedComponents': 'arrow-function',
        },
      ],
      'react/jsx-closing-bracket-location': [
        'error', {
          'nonEmpty': 'after-props',
          'selfClosing': 'tag-aligned',
        },
      ],
      'react/jsx-curly-brace-presence': [
        'warn', {
          'props': 'never',
          'children': 'always',
          'propElementValues': 'always',
        },
      ],
      'react/jsx-first-prop-new-line': ['error', 'multiline'],
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-newline': [
        'error', {
          'prevent': true,
        },
      ],
      'react/jsx-no-literals': [
        'warn', {
          'ignoreProps': true,
          'noStrings': true,
        },
      ],
      'react/jsx-no-useless-fragment': [
        'error', {
          'allowExpressions': true,
        },
      ],
      'react/jsx-max-props-per-line': [
        'error', {
          'maximum': 1,
          'when': 'always',
        },
      ],
      'react/jsx-one-expression-per-line': 'error',
      'react/jsx-props-no-multi-spaces': 'error',
      'react/jsx-wrap-multilines': [
        'error', {
          'arrow': 'parens-new-line',
          'assignment': 'parens-new-line',
          'condition': 'parens-new-line',
          'declaration': 'parens-new-line',
          'logical': 'parens-new-line',
          'prop': 'ignore',
          'return': 'parens',
        },
      ],
      'simple-import-sort/imports': [
        'error', {
          'groups': [
            [
              '^react$',
              '^react-native$',
              'react',
              '^@\\w+/', // Third-party scoped packages with @ followed by word chars then /
              '^[^@.]', // Other third-party packages (starts with @ but not followed by /)
            ],
            [
              '^@/di',
              '^@/components',
              '^@/',
            ],
            ['^\\.'], // Relative imports
          ],
        },
      ],
    },
  },
  {
    ignores: ['dist/*'],
  },
]);
