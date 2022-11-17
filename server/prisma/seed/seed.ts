import { prisma } from '../../src/prisma';
import createChapters from './factories/chapters.factory';
import createEvents from './factories/events.factory';
import createRsvps from './factories/rsvps.factory';
import createSponsors from './factories/sponsors.factory';
import createUsers from './factories/user.factory';
import createVenues from './factories/venues.factory';
import setupRoles from './setupRoles';

async function truncateTables() {
  const ignoredTables = [
    '_prisma_migrations',
    'instance_roles',
    'instance_permissions',
    'instance_role_permissions',
    'chapter_roles',
    'chapter_permissions',
    'chapter_role_permissions',
    'event_roles',
    'event_permissions',
    'event_role_permissions',
    'rsvp',
  ];
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  for (const { tablename } of tablenames) {
    if (!ignoredTables.includes(tablename)) {
      try {
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE;`,
        );
      } catch (error) {
        console.log({ error });
      }
    }
  }
}

(async () => {
  await truncateTables();

  const { ownerId, chapter1AdminId, chapter2AdminId, bannedAdminId, userIds } =
    await createUsers();
  const sponsorIds = await createSponsors();

  const chapterIds = await createChapters(ownerId);
  const chapterIdToVenueIds = await createVenues(chapterIds);

  const eventIds = await createEvents(
    chapterIds,
    chapterIdToVenueIds,
    sponsorIds,
    15,
  );

  await createRsvps(eventIds, userIds);
  await setupRoles(
    { ownerId, chapter1AdminId, chapter2AdminId, bannedAdminId, userIds },
    chapterIds,
  );
})();
