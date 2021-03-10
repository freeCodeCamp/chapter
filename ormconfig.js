/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

// Simple way to access docker DB
const dbConfig = {
  host: process.env.DB_URL,
  port: process.env.DB_PORT || (process.env.IS_DOCKER === '' ? 5432 : 54320),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

module.exports = {
  type: 'postgres',
  ...dbConfig,
  synchronize: false,
  logging: false,
  entities: ['server/models/**/*.ts'],
  migrations: ['db/migrations/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'server/models',
    migrationsDir: 'db/migrations',
    subscribersDir: 'server/subscriber',
  },
};
