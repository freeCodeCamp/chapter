import { prisma } from '../../src/prisma';
import { createRsvpTypes } from './factories/rsvpTypes.factory';
import createInstanceRoles from './factories/instanceRoles.factory';
import createChapterRoles from './factories/chapterRoles.factory';
import createEventRoles from './factories/eventRoles.factory';

export async function truncateTables() {
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
}

export async function createRoles() {
  const instanceRoles = await createInstanceRoles();
  const eventRoles = await createEventRoles();
  const chapterRoles = await createChapterRoles();

  return {
    instanceRoles,
    eventRoles,
    chapterRoles,
  };
}

const myArgs = process.argv.slice(2);
if (myArgs.length === 1 && myArgs[0] === '--execute') {
  // First truncate any existing tables. This is necessary in testing, because
  // the database needs to be initialized before use. However, if we recreate
  // the schema, cached queries targetting the old schema will fail with ERROR:
  // cached plan must not change result type.
  truncateTables().then(() => {
    createRoles();
    createRsvpTypes();
  });
} else if (myArgs.length === 0) {
  // do nothing, it's just being imported and will be called by the importing script
} else {
  console.error(`--To execute:
    node init.ts --execute
--All other arguments are invalid
`);
}

export default createRoles;
