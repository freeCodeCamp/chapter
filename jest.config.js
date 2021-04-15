module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
  moduleDirectories: ['node_modules', 'server'],
  // if we need to use paths in tsconfig, we should use pathsToModuleNameMapper
  // from ts-jest
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  watchPathIgnorePatterns: ['/node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['/**/*.test.(ts|js|tsx|jsx)'],
};
