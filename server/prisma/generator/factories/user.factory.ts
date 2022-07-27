import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

import { prisma } from '../../../src/prisma';

const { internet } = faker;

const createUsers = async (
  instanceRoles: Record<string, { name: string; id: number }>,
): Promise<{
  ownerId: number;
  adminId: number;
  bannedAdminId: number;
  userIds: number[];
}> => {
  const ownerData: Prisma.usersCreateInput = {
    email: 'foo@bar.com',
    first_name: 'Albus',
    last_name: 'Dumbledore',
    instance_role: { connect: { id: instanceRoles.owner.id } },
  };
  const owner = await prisma.users.create({ data: ownerData });

  const adminData: Prisma.usersCreateInput = {
    email: 'admin@of.a.chapter',
    first_name: 'Minerva',
    last_name: 'McGonagall',
    instance_role: { connect: { id: instanceRoles.member.id } },
  };
  const admin = await prisma.users.create({ data: adminData });

  const bannedAdminData: Prisma.usersCreateInput = {
    email: 'banned@chapter.admin',
    first_name: 'Lord',
    last_name: 'Voldemort',
    instance_role: { connect: { id: instanceRoles.member.id } },
  };

  const bannedAdmin = await prisma.users.create({ data: bannedAdminData });

  const userNames = [
    { firstName: 'Dudley', lastName: 'Dursley' },
    { firstName: 'Petunia', lastName: 'Dursley' },
    { firstName: 'Vernon', lastName: 'Dursley' },
    { firstName: 'Drako', lastName: 'Malfoy' },
    { firstName: 'Hermione', lastName: 'Granger' },
    { firstName: 'Ron', lastName: 'Weasley' },
    { firstName: 'James', lastName: 'Potter' },
    { firstName: 'Harry', lastName: 'Potter' },
    { firstName: 'Neville', lastName: 'Longbottom' },
    { firstName: 'Severus', lastName: 'Snape' },
  ];

  const othersData: Prisma.usersCreateInput[] = Array.from(
    new Array(10).keys(),
    (idx: number) => ({
      email: internet.email(),
      first_name: userNames[idx].firstName,
      last_name: userNames[idx].lastName,
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
    adminId: admin.id,
    bannedAdminId: bannedAdmin.id,
    userIds: otherIds,
  };
};

export default createUsers;
