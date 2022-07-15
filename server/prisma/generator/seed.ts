import { prisma } from '../../src/prisma';
import createRoles from './init';
import createChapters from './factories/chapters.factory';
import createEvents from './factories/events.factory';
import createRsvps from './factories/rsvps.factory';
import createSponsors from './factories/sponsors.factory';
import createUsers from './factories/user.factory';
import createVenues from './factories/venues.factory';
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

  const { instanceRoles, chapterRoles, eventRoles } = await createRoles();

  const { ownerId, adminId, bannedAdminId, userIds } = await createUsers(
    instanceRoles,
  );
  const sponsorIds = await createSponsors();

  const chapterIds = await createChapters(ownerId);
  const venueIds = await createVenues(chapterIds[0]);

  const eventIds = await createEvents(chapterIds, venueIds, sponsorIds, 15);

  await createRsvps(eventIds, userIds, eventRoles);
  await setupRoles(
    { ownerId, adminId, bannedAdminId, userIds },
    chapterIds,
    chapterRoles,
  );
})();
