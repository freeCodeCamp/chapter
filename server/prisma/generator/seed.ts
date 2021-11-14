import createChapters from './factories/chapters.factory';
import createEvents from './factories/events.factory';
import createRsvps from './factories/rsvps.factory';
import createSponsors from './factories/sponsors.factory';
import createUsers from './factories/user.factory';
import createVenues from './factories/venues.factory';
import setupRoles from './setupRoles';

(async () => {
  const [userId, userIds] = await createUsers();
  const sponsorIds = await createSponsors();

  const chapterIds = await createChapters(userId);
  const venueIds = await createVenues();

  const eventIds = await createEvents(chapterIds, venueIds, sponsorIds);

  await createRsvps(eventIds, userIds);
  await setupRoles(userId, userIds, chapterIds);
})();
