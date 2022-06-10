module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  moduleDirectories: ['node_modules', 'server'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json',
    },
  },
  watchPathIgnorePatterns: ['/node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['/**/*.test.(ts|tsx)'],
  globalSetup: './global-setup.js',
};
