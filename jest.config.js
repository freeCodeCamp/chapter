/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
  moduleDirectories: ['node_modules', 'server'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  watchPathIgnorePatterns: ['/node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['/**/*.test.(ts|js|tsx|jsx)'],
};
