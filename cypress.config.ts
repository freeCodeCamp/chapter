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
    setupNodeEvents(on, config) {
      // `on` is used to hook into various events Cypress emits
      // `config` is the resolved Cypress config
      if (!process.env.JWT_SECRET)
        throw Error('JWT_SECRET must be set for e2e tests');

      config.env = config.env || {};
      // TODO: ideally the email address should have a common source (since it's
      // used in the db generator, too)
      config.env.JWT = jwt.sign(
        { email: 'foo@bar.com' },
        process.env.JWT_SECRET,
        {
          expiresIn: '120min',
        },
      );
      config.env.JWT_TEST_USER = jwt.sign(
        { email: 'test@user.org' },
        process.env.JWT_SECRET,
        {
          expiresIn: '120min',
        },
      );

      config.env.JWT_CHAPTER_1_ADMIN_USER = jwt.sign(
        { email: 'admin@of.chapter.one' },
        process.env.JWT_SECRET,
        {
          expiresIn: '120min',
        },
      );

      config.env.JWT_CHAPTER_2_ADMIN_USER = jwt.sign(
        { email: 'admin@of.chapter.two' },
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

      config.env.TOKEN_DELETED_USER = jwt.sign(
        { id: -1 },
        process.env.JWT_SECRET,
        {
          expiresIn: '120min',
        },
      );

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

      config.env.SERVER_URL =
        process.env.NEXT_PUBLIC_APOLLO_SERVER || 'http://localhost:5000';
      config.env.GQL_URL = `${config.env.SERVER_URL}/graphql`;

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
