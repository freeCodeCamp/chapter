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

const { execSync } = require('child_process');
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
  config.env.JWT_TEST_USER = jwt.sign(
    { email: 'test@user.org' },
    process.env.JWT_SECRET,
    {
      expiresIn: '120min',
    },
  );

  config.env.JWT_ADMIN_USER = jwt.sign(
    { email: 'admin@of.a.chapter' },
    process.env.JWT_SECRET,
    {
      expiresIn: '120min',
    },
  );

  config.env.JWT_BANNED_ADMIN_USER = jwt.sign(
    { email: 'banned@chapter.admin' },
    process.env.JWT_SECRET,
    {
      expiresIn: '120min',
    },
  );

  config.env.TOKEN_DELETED_USER = jwt.sign({ id: -1 }, process.env.JWT_SECRET, {
    expiresIn: '120min',
  });

  config.env.JWT_EXPIRED = jwt.sign(
    { email: 'foo@bar.com' },
    process.env.JWT_SECRET,
    {
      expiresIn: '1',
    },
  );

  // Standard JWT (with id, exp etc.), but with the signature removed:
  config.env.JWT_UNSIGNED =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjM1ODYzNjQ2LCJleHAiOjE2Mzg1NDIwNDZ9.';

  config.env.JWT_MALFORMED = 'not-a-valid-format';

  // This makes sure the db is populated before running any tests. Without this,
  // it's difficult (when running docker-compose up) to guarantee that both the
  // docker container is running and that the db has been seeded.
  on('before:run', () => {
    execSync('npm run db:reset');
  });
  require('@cypress/code-coverage/task')(on, config);
  return config;
};
