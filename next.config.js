import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

export function webpack(config, options) {
  config.resolve.alias.client = './client';
  config.resolve.alias.server = './server';
  config.plugins.push(new ForkTsCheckerWebpackPlugin());
  return config;
}
