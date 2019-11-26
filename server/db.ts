import 'reflect-metadata';
import { createConnection } from 'typeorm';

export const initDB = createConnection({
  type: 'postgres',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'chapter',
  host: process.env.DB_URL || 'db',
  port: 5432,
  entities: [__dirname + '/models/*.ts'],
  synchronize: false,
  logging: false,
  name: 'default',
});
