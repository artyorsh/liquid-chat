const { pathsToModuleNameMapper } = require('ts-jest');
const jestExpoPreset = require('jest-expo/jest-preset');
const { compilerOptions } = require('./tsconfig.json');

const tscPaths = Object.entries(compilerOptions.paths)
  .filter(([key]) => key !== 'react')
  .reduce((acc, [key, value]) => ({...acc, [key]: value }), {})

const babelJestTransform = jestExpoPreset.transform['\\.[jt]sx?$'];

const transformIgnorePatterns = [
  'react-native',
  '@react-native',
  'expo',
  '@expo',
  '@react-navigation',
  '@lingui',
  '@messageformat',
];

module.exports = {
  preset: 'jest-expo',
  // Lingui v6 ships .mjs; jest-expo only transforms .[jt]sx? by default.
  transform: {
    ...jestExpoPreset.transform,
    '^.+\\.mjs$': babelJestTransform,
  },
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    'react-native-unistyles/mocks',
    '<rootDir>/src/i18n/jest-setup.ts',
    '<rootDir>/src/uilib/index.ts',
    '<rootDir>/src/log/log.service.mock.ts',
    '<rootDir>/src/modal/modal.service.mock.tsx',
    '<rootDir>/src/router/router.mock.ts',
  ],
  moduleNameMapper: pathsToModuleNameMapper(tscPaths, { prefix: '<rootDir>' }),
  transformIgnorePatterns: [
    '/node_modules/(?!(' + transformIgnorePatterns.join('|') + '))',
  ],
  testMatch: [
    '<rootDir>/src/**/*.spec.(ts|tsx)',
  ],
};
