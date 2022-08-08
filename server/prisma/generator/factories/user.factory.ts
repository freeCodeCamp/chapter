import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

import { prisma } from '../../../src/prisma';

const { name, internet } = faker;

const createUsers = async (
  instanceRoles: Record<string, { name: string; id: number }>,
): Promise<{
  ownerId: number;
  chapter1AdminId: number;
  chapter2AdminId: number;
  bannedAdminId: number;
  userIds: number[];
}> => {
  const ownerData: Prisma.usersCreateInput = {
    email: 'foo@bar.com',
    name: `${name.firstName()} ${name.lastName()}`,
    instance_role: { connect: { id: instanceRoles.owner.id } },
  };
  const owner = await prisma.users.create({ data: ownerData });

  const chapter1AdminData: Prisma.usersCreateInput = {
    email: 'admin@of.chapter.one',
    name: `${name.firstName()} ${name.lastName()}`,
    instance_role: { connect: { id: instanceRoles.member.id } },
  };
  const chapter1Admin = await prisma.users.create({ data: chapter1AdminData });

  const chapter2AdminData: Prisma.usersCreateInput = {
    email: 'admin@of.chapter.two',
    name: `${name.firstName()} ${name.lastName()}`,
    instance_role: { connect: { id: instanceRoles.member.id } },
  };
  const chapter2Admin = await prisma.users.create({ data: chapter2AdminData });

  const bannedAdminData: Prisma.usersCreateInput = {
    email: 'banned@chapter.admin',
    name: `${name.firstName()} ${name.lastName()}`,
    instance_role: { connect: { id: instanceRoles.member.id } },
  };

  const bannedAdmin = await prisma.users.create({ data: bannedAdminData });

  const othersData: Prisma.usersCreateInput[] = Array.from(
    new Array(10),
    () => ({
      email: internet.email(),
      name: `${name.firstName()} ${name.lastName()}`,
      instance_role: { connect: { id: instanceRoles.member.id } },
    }),
  );
  const otherIds = (
    await Promise.all(
      othersData.map((other) => prisma.users.create({ data: other })),
    )
  ).map((other) => other.id);

  return {
    ownerId: owner.id,
    chapter1AdminId: chapter1Admin.id,
    chapter2AdminId: chapter2Admin.id,
    bannedAdminId: bannedAdmin.id,
    userIds: otherIds,
  };
};

export default createUsers;
