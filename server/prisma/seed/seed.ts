import { truncateTables, createRoles } from '../init/init';
import createChapters from './factories/chapters.factory';
import createEvents from './factories/events.factory';
import createRsvps from './factories/rsvps.factory';
import createSponsors from './factories/sponsors.factory';
import createUsers from './factories/user.factory';
import createVenues from './factories/venues.factory';
import setupRoles from './setupRoles';

(async () => {
  await truncateTables();
  const { instanceRoles, chapterRoles, eventRoles } = await createRoles();

  const { ownerId, chapter1AdminId, chapter2AdminId, bannedAdminId, userIds } =
    await createUsers(instanceRoles);
  const sponsorIds = await createSponsors();

  const chapterIds = await createChapters(ownerId);
  const chapterIdToVenueIds = await createVenues(chapterIds);

  const eventIds = await createEvents(
    chapterIds,
    chapterIdToVenueIds,
    sponsorIds,
    15,
  );

  await createRsvps(eventIds, userIds, eventRoles);
  await setupRoles(
    { ownerId, chapter1AdminId, chapter2AdminId, bannedAdminId, userIds },
    chapterIds,
    chapterRoles,
  );
})();
