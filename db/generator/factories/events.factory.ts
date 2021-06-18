import { addHours, add } from 'date-fns';
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
  const tags: Tag[] = Array.from(new Array(4)).map(
    () => new Tag({ events: [], name: lorem.words(1) }),
  );
  await Promise.all(tags.map(async (tag) => await tag.save()));

  for (let i = 0; i < 4; i++) {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);

    const start_at = add(date, {
      days: random(10),
      hours: random(5),
      minutes: random(4) * 15,
    });

    console.log(start_at);

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
      start_at,
      ends_at: addHours(start_at, random(5)),
      tags: randomItems(tags, 1 + random(3), true),
    });

    await event.save();

    await Promise.all(
      randomItems(sponsors, 2)
        .map((sponsor) => new EventSponsor({ event, sponsor }))
        .map((es) => es.save()),
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
