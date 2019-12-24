import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Event } from '../models/Event';
import { Chapter } from 'server/models/Chapter';
import { Venue } from 'server/models/Venue';

define(Event, (
  faker: typeof Faker,
  params: { chapter: Chapter; venue: Venue },
) => {
  const name = faker.company.companyName();
  const description = faker.lorem.words();

  const { chapter, venue } = params;

  const event = new Event({
    name,
    chapter,
    description,
    capacity: faker.random.number(1000),
    venue,
    canceled: Math.random() > 0.5,
    start_at: new Date(),
    ends_at: new Date(Date.now() + 1000 * 60 * 60 * 5 * Math.random()),
  });

  return event;
});
