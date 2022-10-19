var config = {
  presets: ['next/babel'],
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
