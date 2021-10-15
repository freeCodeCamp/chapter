import 'reflect-metadata';
import { createConnection } from 'typeorm';

import createChapters from './factories/chapters.factory';
import createEvents from './factories/events.factory';
import createRsvps from './factories/rsvps.factory';
import createSponsors from './factories/sponsors.factory';
import createUsers from './factories/user.factory';
import createVenues from './factories/venues.factory';
import setupRoles from './setupRoles';

(async () => {
  const connection = await createConnection();

  const [user, users] = await createUsers();
  const sponsors = await createSponsors();

  const chapters = await createChapters(user);
  const venues = await createVenues();

  const events = await createEvents(chapters, venues, sponsors);

  await createRsvps(events, users);
  await setupRoles(user, users, chapters);

  await connection.close();
})();
