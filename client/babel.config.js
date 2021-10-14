var config = {
  presets: ['next/babel'],
  plugins: [],
};

if (process.env.NODE_ENV === 'development') {
  config.plugins.push(['@codesee/instrument', { hosted: true }]);
}

module.exports = config;
