import 'reflect-metadata';
import {
  createConnection,
  getConnectionOptions,
  ConnectionOptions,
} from 'typeorm';

export const initDB = (async () => {
  const connectionOptions = await getConnectionOptions();
  return createConnection({
    ...connectionOptions,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'chapter',
    host: process.env.DB_URL || 'db',
    port: 5432,
  } as ConnectionOptions);
})();
