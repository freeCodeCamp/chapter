import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';
import { InstanceRoles } from '../../../../common/roles';

import { prisma } from '../../../src/prisma';

const { name, internet } = faker;

const createUsers = async (): Promise<{
  ownerId: number;
  chapter1AdminId: number;
  chapter2AdminId: number;
  bannedAdminId: number;
  userIds: number[];
}> => {
  // TODO: query once and pass this on to setupRoles
  const instanceRoles = await prisma.instance_roles.findMany();
  const ownerRoleId = instanceRoles.find(
    ({ name }) => name === InstanceRoles.owner,
  )?.id;
  const chapterAdministratorRoleId = instanceRoles.find(
    ({ name }) => name === InstanceRoles.chapter_administrator,
  )?.id;
  const memberRoleId = instanceRoles.find(
    ({ name }) => name === InstanceRoles.member,
  )?.id;

  if (!ownerRoleId || !chapterAdministratorRoleId || !memberRoleId)
    throw new Error('Missing instance roles');

  const ownerData: Prisma.usersCreateInput = {
    email: 'foo@bar.com',
    name: 'The Owner',
    instance_role: { connect: { id: ownerRoleId } },
  };
  const owner = await prisma.users.create({ data: ownerData });

  const chapter1AdminData: Prisma.usersCreateInput = {
    email: 'admin@of.chapter.one',
    name: 'Chapter One Admin',
    instance_role: { connect: { id: chapterAdministratorRoleId } },
  };
  const chapter1Admin = await prisma.users.create({ data: chapter1AdminData });

  const chapter2AdminData: Prisma.usersCreateInput = {
    email: 'admin@of.chapter.two',
    name: 'Chapter Two Admin',
    instance_role: { connect: { id: chapterAdministratorRoleId } },
  };
  const chapter2Admin = await prisma.users.create({ data: chapter2AdminData });

  const bannedAdminData: Prisma.usersCreateInput = {
    email: 'banned@chapter.admin',
    name: 'Banned Chapter Admin',
    instance_role: { connect: { id: chapterAdministratorRoleId } },
  };

  const bannedAdmin = await prisma.users.create({ data: bannedAdminData });

  const testUserData: Prisma.usersCreateInput = {
    email: 'test@user.org',
    name: 'Test User',
    instance_role: { connect: { id: memberRoleId } },
  };

  await prisma.users.create({ data: testUserData });

  const othersData: Prisma.usersCreateInput[] = Array.from(
    new Array(9),
    () => ({
      email: internet.email(),
      name: `${name.firstName()} ${name.lastName()}`,
      instance_role: { connect: { id: memberRoleId } },
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
