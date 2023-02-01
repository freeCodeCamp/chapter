var config = {
  presets: ['next/babel'],
  plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
  env: {
    test: {
      plugins: ['istanbul'],
    },
  },
};

if (process.env.NODE_ENV === 'development' && process.env.CODESEE === 'true') {
  config.plugins.push(['@codesee/instrument', { hosted: true }]);
}

module.exports = config;
