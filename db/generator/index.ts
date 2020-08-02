import 'reflect-metadata';
import { createConnection } from 'typeorm';

import createUsers from './factories/user.factory';
import createLocations from './factories/locations.factory';
import createChapters from './factories/chapters.factory';
import createVenues from './factories/venues.factory';
import createEvents from './factories/events.factory';
import createSponsors from './factories/sponsors.factory';

(async () => {
  const connection = await createConnection();

  const [user] = await createUsers();
  const locations = await createLocations();
  const sponsors = await createSponsors();

  const chapters = await createChapters(locations, user);
  const venues = await createVenues(locations);

  const events = await createEvents(chapters, venues, sponsors);

  // console.log last thing or ts will complain
  console.log(events.length);

  await connection.close();
})();
