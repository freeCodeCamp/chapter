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
  const sponsorIds = await createSponsors();

  const chapterIds = await createChapters(user);
  const venueIds = await createVenues();

  const eventIds = await createEvents(chapterIds, venueIds, sponsorIds);

  await createRsvps(
    eventIds,
    users.map(({ id }) => id),
  );
  await setupRoles(
    user.id,
    users.map(({ id }) => id),
    chapterIds,
  );

  await connection.close();
})();
