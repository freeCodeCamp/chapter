import { prisma } from '../../../src/prisma';

export default function createSession(userId: number) {
  return prisma.sessions.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}
