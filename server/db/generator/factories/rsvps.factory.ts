import { date } from 'faker';
import { random, randomItems } from '../lib/random';
import { Event, User, Rsvp } from 'src/models';

const createRsvps = async (events: Event[], users: User[]): Promise<Rsvp[]> => {
  const rsvps: Rsvp[] = [];

  for (const event of events) {
    const eventUsers = randomItems(users, users.length / 2);
    const numberWaiting = 1 + random(eventUsers.length - 1);
    for (let i = 0; i < eventUsers.length; i++) {
      const rsvp = new Rsvp({
        event,
        user: eventUsers[i],
        date: date.future(),
        on_waitlist: i < numberWaiting,
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
