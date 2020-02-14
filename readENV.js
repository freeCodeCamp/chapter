/* eslint-disable @typescript-eslint/no-var-requires */
const { config } = require('dotenv');

config();

const entries = Object.keys(process.env)
  .filter(
    item =>
      item.startsWith('DB') ||
      item.startsWith('EMAIL') ||
      item.startsWith('CHAPTER') ||
      item.startsWith('IS'),
  )
  .map(item => [item, process.env[item]]);

const env = entries.reduce((obj, [key, value]) => {
  obj[key] = value;
  return obj;
}, {});

console.log(env);
