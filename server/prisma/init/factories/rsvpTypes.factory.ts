import { prisma } from '../../../src/prisma';

export const createRsvpTypes = async () => {
  const rsvpNames = ['yes', 'no', 'maybe', 'waitlist'];
  await prisma.rsvp.createMany({
    data: rsvpNames.map((rsvp) => ({ name: rsvp })),
  });
};
