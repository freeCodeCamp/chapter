import { addDays, addHours } from 'date-fns';
import { company, internet, lorem } from 'faker';
import {
  Chapter,
  Event,
  EventSponsor,
  Sponsor,
  Tag,
  Venue,
  VenueType,
} from '../../../server/models';
import { random, randomEnum, randomItem, randomItems } from '../lib/random';

const createEvents = async (
  chapters: Chapter[],
  venues: Venue[],
  sponsors: Sponsor[],
): Promise<Event[]> => {
  const events: Event[] = [];

  for (let i = 0; i < 4; i++) {
    const start_at = addHours(
      addDays(new Date(), random(10)),
      Math.random() * 5,
    );

    const event = new Event({
      name: company.companyName(),
      chapter: randomItem(chapters),
      description: lorem.words(),
      url: internet.url(),
      video_url: internet.url(),
      venue_type: randomEnum(VenueType),
      capacity: random(1000),
      venue: randomItem(venues),
      canceled: Math.random() > 0.5,
      ends_at: addHours(start_at, Math.random() * 5),
      start_at,
    });

    await event.save();

    await Promise.all(
      randomItems(sponsors, 2)
        .map((sponsor) => new EventSponsor({ event, sponsor }))
        .map((es) => es.save()),
    );

    await Promise.all(
      Array.from(new Array(1 + random(3)), () => {
        const tag = new Tag({ event, name: lorem.words(1) });
        return tag.save();
      }),
    );

    events.push(event);
  }

  try {
    await Promise.all(events.map((event) => event.save()));
  } catch (e) {
    console.error(e);
    throw new Error('Error seeding events');
  }

  return events;
};

export default createEvents;
