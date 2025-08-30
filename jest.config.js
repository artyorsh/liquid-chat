const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

const tscPaths = Object.entries(compilerOptions.paths)
  .filter(([key]) => key !== 'react')
  .reduce((acc, [key, value]) => ({...acc, [key]: value }), {})

module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    'react-native-unistyles/mocks',
    '<rootDir>/src/uilib/index.ts',
    '<rootDir>/src/auth/session/session.service.mock.ts',
    '<rootDir>/src/log/log.service.mock.ts',
    '<rootDir>/src/push-notification/push-notification.service.mock.ts',
    '<rootDir>/src/modal/modal.service.mock.tsx',
    '<rootDir>/src/router/router.mock.ts',
    '<rootDir>/src/user/user.service.mock.ts',
  ],
  moduleNameMapper: pathsToModuleNameMapper(tscPaths, { prefix: '<rootDir>' }),
  testMatch: [
    '<rootDir>/src/**/*.spec.(ts|tsx)',
  ],
};
