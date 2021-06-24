/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config({ path: '../.env' });

// Simple way to access docker DB
const dbConfig = {
  host: process.env.DB_URL,
  port:
    process.env.DB_PORT || (process.env.IS_DOCKER === 'true' ? 54320 : 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

module.exports = {
  type: 'postgres',
  ...dbConfig,
  synchronize: process.env.NODE_ENV === 'development',
  logging: false,
  entities: ['src/models/**/*.js'],
  migrations: ['db/migrations/**/*.js'],
  subscribers: ['src/subscriber/**/*.js'],
  cli: {
    entitiesDir: 'src/models',
    migrationsDir: 'db/migrations',
    subscribersDir: 'src/subscriber',
  },
};
