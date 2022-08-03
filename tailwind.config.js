const path = require('path');

module.exports = {
  content: [path.join(__dirname, './client/src/**/*.{js,ts,jsx,tsx}')],
  theme: {
    extend: {},
  },
  plugins: [],
};
