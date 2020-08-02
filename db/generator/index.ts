import 'reflect-metadata';
import { createConnection } from 'typeorm';
import createUsers from './factories/user.factory';
import createLocations from './factories/locations.factory';

(async () => {
  const connection = await createConnection();

  const [user] = await createUsers();
  const locations = await createLocations();

  await connection.close();
})();
