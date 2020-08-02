import { company, lorem } from 'faker';
import { Event, Venue, Chapter } from '../../../server/models';
import { randomItem, random } from '../lib/random';

const createEvents = async (
  chapters: Chapter[],
  venues: Venue[],
): Promise<Event[]> => {
  const events: Event[] = [];

  for (let i = 0; i < 4; i++) {
    const event = new Event({
      name: company.companyName(),
      chapter: randomItem(chapters),
      description: lorem.words(),
      capacity: random(1000),
      venue: randomItem(venues),
      canceled: Math.random() > 0.5,
      start_at: new Date(),
      ends_at: new Date(Date.now() + 1000 * 60 * 60 * 5 * Math.random()),
    });

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
