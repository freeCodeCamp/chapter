import { faker } from '@faker-js/faker';
import { Prisma, events_venue_type_enum } from '@prisma/client';
import { addHours, add } from 'date-fns';

import { prisma } from '../../../src/prisma';
import {
  random,
  randomEnum,
  randomItem,
  randomItems,
  shuffle,
} from '../lib/random';

const { company, internet, lorem, image } = faker;

const createEvents = async (
  chapterIds: number[],
  chapterIdToVenueIds: { [id: number]: number[] },
  sponsorIds: number[],
  count: number,
): Promise<number[]> => {
  const events: number[] = [];
  const halfCount: number = Math.floor(count + 1 / 2);
  const inviteOnly: boolean[] = [
    ...new Array<boolean>(halfCount).fill(false),
    ...new Array<boolean>(halfCount).fill(true),
  ];
  const canceled = [
    ...new Array<boolean>(halfCount).fill(false),
    ...new Array<boolean>(halfCount).fill(true),
  ];
  shuffle(inviteOnly);
  shuffle(canceled);
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);

    const start_at = add(date, {
      days: random(10) + 1,
      hours: random(5),
      minutes: random(4) * 15,
    });

    const chapterId = i === 0 ? 1 : randomItem(chapterIds);
    const venueIds = chapterIdToVenueIds[chapterId];

    const venueType = randomEnum(events_venue_type_enum);
    const venueData = {
      ...(venueType !== events_venue_type_enum.Physical && {
        streaming_url: internet.url(),
      }),
      ...(venueType !== events_venue_type_enum.Online && {
        venue: { connect: { id: randomItem(venueIds) } },
      }),
    };

    const eventData: Prisma.eventsCreateInput = {
      name: company.companyName(),
      chapter: { connect: { id: chapterId } },
      description: lorem.words(),
      url: internet.url(),
      venue_type: venueType,
      capacity: random(1000),
      canceled: canceled[i],
      // Setting the first event to be open, so that we can test the RSVP flow
      invite_only: i == 0 ? false : inviteOnly[i],
      start_at,
      ends_at: addHours(start_at, random(5)),
      image_url: image.imageUrl(640, 480, 'nature', true),
      ...venueData,
    };

    const event = await prisma.events.create({ data: eventData });

    await Promise.all(
      randomItems(sponsorIds, 2).map(async (sponsor) => {
        const eventSponsorData: Prisma.event_sponsorsCreateInput = {
          event: { connect: { id: event.id } },
          sponsor: { connect: { id: sponsor } },
        };
        return prisma.event_sponsors.create({ data: eventSponsorData });
      }),
    );

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
      'Svelete',
      'SveleteKit',
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

    await prisma.events.update({
      where: { id: event.id },
      data: {
        tags: {
          create: connectOrCreateTags,
        },
      },
    });

    events.push(event.id);
  }
  return events;
};

export default createEvents;
