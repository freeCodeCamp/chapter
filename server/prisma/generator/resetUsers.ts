import { prisma } from '../../src/prisma';

(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "users" CASCADE;`;
})();
