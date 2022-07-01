import { execSync } from 'child_process';

import { defineConfig } from 'cypress';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import coverage from '@cypress/code-coverage/task';

config();

export default defineConfig({
  e2e: {
    projectId: 're65q6',
    baseUrl: 'http://localhost:3000',
    retries: { runMode: 3, openMode: 3 },
    supportFile: 'cypress/support/index.js',
    setupNodeEvents(on, config) {
      // `on` is used to hook into various events Cypress emits
      // `config` is the resolved Cypress config
      config.env = config.env || {};
      // TODO: ideally the email address should have a common source (since it's
      // used in the db generator, too)
      config.env.JWT = jwt.sign(
        { email: 'foo@bar.com' },
        process.env.JWT_SECRET!,
        {
          expiresIn: '120min',
        },
      );
      config.env.JWT_TEST_USER = jwt.sign(
        { email: 'test@user.org' },
        process.env.JWT_SECRET!,
        {
          expiresIn: '120min',
        },
      );

      config.env.JWT_ADMIN_USER = jwt.sign(
        { email: 'admin@of.a.chapter' },
        process.env.JWT_SECRET!,
        {
          expiresIn: '120min',
        },
      );

      config.env.JWT_BANNED_ADMIN_USER = jwt.sign(
        { email: 'banned@chapter.admin' },
        process.env.JWT_SECRET!,
        {
          expiresIn: '120min',
        },
      );

      config.env.TOKEN_DELETED_USER = jwt.sign(
        { id: -1 },
        process.env.JWT_SECRET!,
        {
          expiresIn: '120min',
        },
      );

      config.env.JWT_EXPIRED = jwt.sign(
        { email: 'foo@bar.com' },
        process.env.JWT_SECRET!,
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
      coverage(on, config);
      return config;
    },
  },
  env: {
    mailHogUrl: 'http://localhost:8025',
  },
});
