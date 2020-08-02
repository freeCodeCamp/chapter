import 'reflect-metadata';
import { createConnection } from 'typeorm';

import createUsers from './factories/user.factory';
import createLocations from './factories/locations.factory';
import createChapters from './factories/chapters.factory';

(async () => {
  const connection = await createConnection();

  const [user] = await createUsers();
  const locations = await createLocations();
  const chapters = await createChapters(locations, user);

  // console.log last thing or ts will complain
  console.log(chapters.length);

  await connection.close();
})();
