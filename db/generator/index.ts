import 'reflect-metadata';
import { createConnection } from 'typeorm';

import createUsers from './factories/user.factory';
import createLocations from './factories/locations.factory';
import createChapters from './factories/chapters.factory';
import createVenues from './factories/venues.factory';

(async () => {
  const connection = await createConnection();

  const [user] = await createUsers();
  const locations = await createLocations();

  const chapters = await createChapters(locations, user);
  const venues = await createVenues(locations);

  // console.log last thing or ts will complain
  console.log(chapters.length, venues.length);

  await connection.close();
})();
