import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

import { prisma } from '../../../src/prisma';

const { name, internet } = faker;

const createUsers = async (
  instanceRoles: Record<string, { name: string; id: number }>,
): Promise<{ ownerId: number; adminId: number; userIds: number[] }> => {
  const ownerData: Prisma.usersCreateInput = {
    email: 'foo@bar.com',
    first_name: name.firstName(),
    last_name: name.lastName(),
    instance_role: { connect: { id: instanceRoles.owner.id } },
  };
  const owner = await prisma.users.create({ data: ownerData });

  const adminData: Prisma.usersCreateInput = {
    email: 'admin@of.a.chapter',
    first_name: name.firstName(),
    last_name: name.lastName(),
    instance_role: { connect: { id: instanceRoles.member.id } },
  };
  const admin = await prisma.users.create({ data: adminData });

  const othersData: Prisma.usersCreateInput[] = Array.from(
    new Array(10),
    () => ({
      email: internet.email(),
      first_name: name.firstName(),
      last_name: name.lastName(),
      instance_role: { connect: { id: instanceRoles.member.id } },
    }),
  );
  const otherIds = (
    await Promise.all(
      othersData.map((other) => prisma.users.create({ data: other })),
    )
  ).map((other) => other.id);

  return { ownerId: owner.id, adminId: admin.id, userIds: otherIds };
};

export default createUsers;
