import { prisma } from '../../src/prisma';
import createChapters from './factories/chapters.factory';
import createChapterRoles from './factories/chapterRoles.factory';
import createEvents from './factories/events.factory';
import createEventRoles from './factories/eventRoles.factory';
import createRsvps from './factories/rsvps.factory';
import createSponsors from './factories/sponsors.factory';
import createUsers from './factories/user.factory';
import createVenues from './factories/venues.factory';
import createInstanceRoles from './factories/instanceRoles.factory';
import setupRoles from './setupRoles';

(async () => {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      try {
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE;`,
        );
      } catch (error) {
        console.log({ error });
      }
    }
  }

  const instanceRoles = await createInstanceRoles();

  const { ownerId, adminId, bannedAdminId, userIds } = await createUsers(
    instanceRoles,
  );
  const sponsorIds = await createSponsors();

  const chapterIds = await createChapters(ownerId);
  const venueIds = await createVenues();

  const eventIds = await createEvents(chapterIds, venueIds, sponsorIds, 15);

  const eventRoles = await createEventRoles();
  await createRsvps(eventIds, userIds, eventRoles);
  const chapterRoles = await createChapterRoles();
  await setupRoles(
    { ownerId, adminId, bannedAdminId, userIds },
    chapterIds,
    chapterRoles,
  );
})();
