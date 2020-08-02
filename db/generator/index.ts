import 'reflect-metadata';
import { createConnection } from 'typeorm';
import createUsers from './user.factory';

(async () => {
  const connection = await createConnection();

  const [user] = await createUsers();

  await connection.close();
})();
