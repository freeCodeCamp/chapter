import { company, lorem, internet } from 'faker';
import {
  Event,
  Venue,
  Chapter,
  Sponsor,
  EventSponsor,
  Tag,
} from '../../../server/models';
import { randomItem, random, randomItems } from '../lib/random';

const createEvents = async (
  chapters: Chapter[],
  venues: Venue[],
  sponsors: Sponsor[],
): Promise<Event[]> => {
  const events: Event[] = [];

  for (let i = 0; i < 4; i++) {
    const event = new Event({
      name: company.companyName(),
      chapter: randomItem(chapters),
      description: lorem.words(),
      url: internet.url(),
      capacity: random(1000),
      venue: randomItem(venues),
      canceled: Math.random() > 0.5,
      start_at: new Date(),
      ends_at: new Date(Date.now() + 1000 * 60 * 60 * 5 * Math.random()),
    });

    await event.save();

    await Promise.all(
      randomItems(sponsors, 2)
        .map(sponsor => new EventSponsor({ event, sponsor }))
        .map(es => es.save()),
    );

    await Promise.all(
      Array.from(new Array(1 + random(5)), () => {
        const tag = new Tag({ event, name: lorem.words(1 + random(3)) });
        return tag.save();
      }),
    );

    events.push(event);
  }

  try {
    await Promise.all(events.map(event => event.save()));
  } catch (e) {
    console.error(e);
    throw new Error('Error seeding events');
  }

  return events;
};

export default createEvents;
