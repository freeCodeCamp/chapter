import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

import { prisma } from '../../../src/prisma';

const { company, address } = faker;

const createVenues = async (chapterId: number): Promise<number[]> => {
  const venueIds: number[] = [];

  for (let i = 0; i < 4; i++) {
    const venueData: Prisma.venuesCreateInput = {
      name: company.companyName(),
      city: address.city(),
      region: address.state(),
      postal_code: address.zipCode(),
      country: address.country(),
      street_address: Math.random() > 0.5 ? address.streetAddress() : undefined,
      chapter: { connect: { id: chapterId } },
    };

    // TODO: batch this once createMany returns the records.
    const venue = await prisma.venues.create({ data: venueData });

    venueIds.push(venue.id);
  }

  return venueIds;
};

export default createVenues;
