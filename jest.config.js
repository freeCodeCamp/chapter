module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
  moduleDirectories: ['node_modules', 'server'],
  moduleNameMapper: {
    '^server/(.*)': '<rootDir>/server/$1',
  },
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  watchPathIgnorePatterns: ['/node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['/**/*.test.(ts|js|tsx|jsx)'],
};
