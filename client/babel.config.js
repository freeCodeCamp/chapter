var config = {
  presets: ['next/babel'],
  plugins: [],
};

if (
  process.env.NODE_ENV === 'development' &&
  !process.env.GITPOD_WORKSPACE_URL
) {
  config.plugins.push(['@codesee/instrument', { hosted: true }]);
}

module.exports = config;
