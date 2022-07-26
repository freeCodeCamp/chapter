import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

import { prisma } from '../../../src/prisma';

const { company, address } = faker;

const createVenues = async (
  chapterIds: number[],
): Promise<{ [x: number]: number[] }> => {
  const chapterIdToVenueIds: {
    [x: number]: number[];
  } = chapterIds
    .map((id) => ({ [id]: [] }))
    .reduce((acc, curr) => ({ ...acc, ...curr }));

  for (const chapterId of chapterIds) {
    for (let i = 0; i < 4; i++) {
      const venueData: Prisma.venuesCreateInput = {
        name: company.companyName(),
        city: address.city(),
        region: address.state(),
        postal_code: address.zipCode(),
        country: address.country(),
        street_address:
          Math.random() > 0.5 ? address.streetAddress() : undefined,
        chapter: { connect: { id: chapterId } },
      };

      // TODO: batch this once createMany returns the records.
      const venue = await prisma.venues.create({ data: venueData });

      chapterIdToVenueIds[chapterId].push(venue.id);
    }
  }

  return chapterIdToVenueIds;
};

export default createVenues;
