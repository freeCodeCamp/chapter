import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

import { prisma } from '../../../src/prisma';

const { name, internet } = faker;

const createUsers = async (): Promise<[number, number[]]> => {
  // TODO: add seeding admin
  const userData: Prisma.usersCreateInput = {
    email: 'foo@bar.com',
    first_name: name.firstName(),
    last_name: name.lastName(),
  };

  const user = await prisma.users.create({ data: userData });

  const othersData: Prisma.usersCreateInput[] = Array.from(
    new Array(10),
    () => ({
      email: internet.email(),
      first_name: name.firstName(),
      last_name: name.lastName(),
    }),
  );

  const otherIds = (
    await Promise.all(
      othersData.map((other) => prisma.users.create({ data: other })),
    )
  ).map((other) => other.id);

  return [user.id, otherIds];
};

export default createUsers;
