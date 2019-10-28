import { Sequelize } from 'sequelize-typescript';
import { Chapter } from './chapter';

export const initSequelize = () =>
  new Sequelize({
    dialect: 'postgres',
    username: 'postgres',
    password: 'password',
    database: 'chapter',
    host: 'db',
    port: 5432,
    models: [Chapter],
  });
