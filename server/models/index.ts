import { Sequelize } from 'sequelize-typescript';
import { Chapter } from './chapter';

export const initSequelize = () =>
  new Sequelize({
    dialect: 'postgres',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'chapter',
    host: 'db',
    port: 5432,
    models: [Chapter],
  });
