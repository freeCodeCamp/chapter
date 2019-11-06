import { Sequelize } from 'sequelize-typescript';

export const initSequelize = new Sequelize({
  dialect: 'postgres',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'chapter',
  host: process.env.DB_URL || 'db',
  port: 5432,
  models: [__dirname + '/models/*.ts'],
});
