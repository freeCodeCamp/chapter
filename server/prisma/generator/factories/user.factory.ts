import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

import { prisma } from '../../../src/prisma';
import { RoleMap } from './instanceRoles.factory';

const { name, internet } = faker;

const createUsers = async (
  instanceRoles: Required<RoleMap>,
): Promise<{
  ownerId: number;
  chapter1AdminId: number;
  chapter2AdminId: number;
  bannedAdminId: number;
  userIds: number[];
}> => {
  const ownerData: Prisma.usersCreateInput = {
    email: 'foo@bar.com',
    name: 'The Owner',
    instance_role: { connect: { id: instanceRoles.owner.id } },
  };
  const owner = await prisma.users.create({ data: ownerData });

  const chapter1AdminData: Prisma.usersCreateInput = {
    email: 'admin@of.chapter.one',
    name: 'Chapter One Admin',
    instance_role: { connect: { id: instanceRoles.chapter_administrator.id } },
  };
  const chapter1Admin = await prisma.users.create({ data: chapter1AdminData });

  const chapter2AdminData: Prisma.usersCreateInput = {
    email: 'admin@of.chapter.two',
    name: 'Chapter Two Admin',
    instance_role: { connect: { id: instanceRoles.chapter_administrator.id } },
  };
  const chapter2Admin = await prisma.users.create({ data: chapter2AdminData });

  const bannedAdminData: Prisma.usersCreateInput = {
    email: 'banned@chapter.admin',
    name: 'Banned Chapter Admin',
    instance_role: { connect: { id: instanceRoles.chapter_administrator.id } },
  };

  const bannedAdmin = await prisma.users.create({ data: bannedAdminData });

  const testUserData: Prisma.usersCreateInput = {
    email: 'test@user.org',
    name: 'Test User',
    instance_role: { connect: { id: instanceRoles.member.id } },
  };

  await prisma.users.create({ data: testUserData });

  const othersData: Prisma.usersCreateInput[] = Array.from(
    new Array(9),
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
