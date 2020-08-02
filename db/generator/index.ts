import 'reflect-metadata';
import { createConnection } from 'typeorm';
import createUsers from './user.factory';
import createLocations from './locations.factory';

(async () => {
  const connection = await createConnection();

  const [user] = await createUsers();
  const locations = await createLocations();

  await connection.close();
})();
