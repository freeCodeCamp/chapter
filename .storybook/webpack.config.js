module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      presets: [require.resolve('@babel/preset-react')],
    },
  });

  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
