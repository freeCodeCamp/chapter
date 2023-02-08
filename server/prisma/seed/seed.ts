import { prisma } from '../../src/prisma';
import createAttendance from './factories/attendance.factory';
import createChapters from './factories/chapters.factory';
import createEvents from './factories/events.factory';
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
    'attendance',
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

async function seed() {
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

  await createAttendance(eventIds, userIds);
  await setupRoles(
    { ownerId, chapter1AdminId, chapter2AdminId, bannedAdminId, userIds },
    chapterIds,
  );
}

const myArgs = process.argv.slice(2);
// Truncation, rather than resetting, is necessary in testing, because the
// database needs to be initialized before use. However, if we recreate the
// schema, cached queries targetting the old schema will fail with ERROR: cached
// plan must not change result type.
if (myArgs.length === 1 && myArgs[0] === '--truncate-only') {
  truncateTables();
} else if (myArgs.length === 0) {
  truncateTables().then(seed);
} else {
  console.error(`--To execute:
    node seed.js
or
    node seed.js --truncate-only
--All other arguments are invalid
`);
}
