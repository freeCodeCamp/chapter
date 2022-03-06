import { faker } from '@faker-js/faker';
import { Prisma, events_venue_type_enum } from '@prisma/client';
import { addHours, add } from 'date-fns';

import { prisma } from '../../../src/prisma';
import { random, randomEnum, randomItem, randomItems } from '../lib/random';

const { company, internet, lorem, image } = faker;

const createEvents = async (
  chapterIds: number[],
  venueIds: number[],
  sponsorIds: number[],
  count: number,
): Promise<number[]> => {
  const events: number[] = [];

  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);

    const start_at = add(date, {
      days: random(10),
      hours: random(5),
      minutes: random(4) * 15,
    });

    const eventData: Prisma.eventsCreateInput = {
      name: company.companyName(),
      chapter: { connect: { id: randomItem(chapterIds) } },
      description: lorem.words(),
      url: internet.url(),
      streaming_url: internet.url(),
      venue_type: randomEnum(events_venue_type_enum),
      capacity: random(1000),
      venue: { connect: { id: randomItem(venueIds) } },
      canceled: Math.random() > 0.5,
      start_at,
      ends_at: addHours(start_at, random(5)),
      image_url: image.imageUrl(640, 480, 'nature', true),
    };

    const event = await prisma.events.create({ data: eventData });

    await Promise.all(
      randomItems(sponsorIds, 2).map(async (sponsor) => {
        const eventSponsorData: Prisma.event_sponsorsCreateInput = {
          events: { connect: { id: event.id } },
          sponsor: { connect: { id: sponsor } },
        };
        return prisma.event_sponsors.create({ data: eventSponsorData });
      }),
    );

    const tagNames = Array.from(new Array(1 + random(3)), () => lorem.word());
    const tagsData = tagNames.map((tagName) => ({ name: tagName }));
    await prisma.tags.createMany({
      data: tagsData,
      skipDuplicates: true,
    });
    const tags = await prisma.tags.findMany({
      where: { name: { in: tagNames } },
    });
    await prisma.event_tags.createMany({
      data: tags.map((tag) => ({ tag_id: tag.id, event_id: event.id })),
    });

    events.push(event.id);
  }
  return events;
};

export default createEvents;
