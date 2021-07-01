import { Event, User, Rsvp } from '../../../server/models';
import { randomItems } from '../lib/random';
import { date } from 'faker';

const createRsvps = async (events: Event[], users: User[]): Promise<Rsvp[]> => {
  const rsvps: Rsvp[] = [];

  for (const event of events) {
    for (const user of randomItems(users, users.length / 2)) {
      const rsvp = new Rsvp({
        event,
        user,
        date: date.future(),
        on_waitlist: Math.random() > 0.5,
        confirmed_at: new Date(),
      });
      rsvps.push(rsvp);
    }
  }

  try {
    await Promise.all(rsvps.map((rsvp) => rsvp.save()));
  } catch (e) {
    console.error(e);
    throw new Error('Error seeding rsvps');
  }

  return rsvps;
};

export default createRsvps;
