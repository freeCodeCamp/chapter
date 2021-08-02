/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

require('dotenv').config();

const jwt = require('jsonwebtoken');

// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  config.env = config.env || {};
  // TODO: ideally the email address should have a common source (since it's
  // used in the db generator, too)
  config.env.JWT = jwt.sign({ email: 'foo@bar.com' }, process.env.JWT_SECRET, {
    expiresIn: '120min',
  });
  return config;
};
