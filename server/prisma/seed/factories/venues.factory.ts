import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

import { prisma } from '../../../src/prisma';
import { randomItems } from '../lib/random';

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
      const tagNames = [
        'GraphQl',
        'NodeJs',
        'JavaScript',
        'TypeScript',
        'HTML',
        'CSS',
        'Cypress',
        'Tailwind',
        'Sass',
        'BootStrap',
        'React',
        'Vue',
        'NextJs',
        'NuxtJs',
        'Angular',
        'Svelte',
        'SvelteKit',
        'Vite',
        'Prisma',
        'Ruby',
        'Rust',
      ];
      const tagsCount = Math.round((Math.random() * tagNames.length) / 5);

      const selectedTags = randomItems(tagNames, tagsCount, true);
      const connectOrCreateTags = selectedTags.map((name) => ({
        tag: {
          connectOrCreate: {
            where: { name },
            create: { name },
          },
        },
      }));
      const venueData: Prisma.venuesCreateInput = {
        name: company.companyName(),
        city: address.city(),
        region: address.state(),
        postal_code: address.zipCode(),
        country: address.country(),
        street_address:
          Math.random() > 0.5 ? address.streetAddress() : undefined,
        chapter: { connect: { id: chapterId } },
        venue_tags: { create: connectOrCreateTags },
      };

      // TODO: batch this once createMany returns the records.
      const venue = await prisma.venues.create({ data: venueData });

      chapterIdToVenueIds[chapterId].push(venue.id);
    }
  }

  return chapterIdToVenueIds;
};

export default createVenues;
