const path = require('path');
const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');

module.exports = ({ config }) => {
  config.module.rules.push(
    {
      test: /\.(stories|story)\.mdx?$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [require.resolve('@babel/preset-react')],
          },
        },
        {
          loader: require.resolve('@mdx-js/loader'),
          options: {
            compilers: [createCompiler({})],
          },
        },
      ],
    },
    {
      test: /\.tsx?$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [require.resolve('@babel/preset-react')],
          },
        },
        {
          loader: require.resolve('react-docgen-typescript-loader'),
          options: {
            tsconfigPath: path.resolve(__dirname, '../tsconfig.json'),
          },
        },
      ],
    },
    {
      test: /\.(stories|story)\.tsx?$/,
      exclude: path.resolve(__dirname, '../node_modules/'),
      use: [
        {
          // needed for storysource-addon
          loader: require.resolve('@storybook/addon-storysource/loader'),
          options: { parser: 'typescript' },
        },
        {
          // needed for docs addon
          loader: '@storybook/source-loader',
          options: { injectParameters: true },
        },
      ],
      enforce: 'pre',
    },
  );

  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
