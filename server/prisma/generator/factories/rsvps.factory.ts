import { date } from 'faker';
import { random, randomItems } from '../lib/random';
import { makeBooleanIterator } from '../lib/util';
import { Event, User, Rsvp, UserEventRole } from 'src/models';

const createRsvps = async (events: Event[], users: User[]): Promise<Rsvp[]> => {
  const rsvps: Rsvp[] = [];
  const userEventRoles: UserEventRole[] = [];

  const eventIterator = makeBooleanIterator();
  for (const event of events) {
    const eventUsers = randomItems(users, users.length / 2);
    const numberWaiting = 1 + random(eventUsers.length - 2);
    const numberCanceled = 1 + random(eventUsers.length - numberWaiting - 1);

    // makes sure half of each event's users are organisers, but
    // alternates which half.
    const organizerIterator = makeBooleanIterator(eventIterator.next().value);

    for (let i = 0; i < eventUsers.length; i++) {
      const on_waitlist = i < numberWaiting;
      const canceled = !on_waitlist && i < numberWaiting + numberCanceled;
      const rsvp = new Rsvp({
        event,
        user: eventUsers[i],
        date: date.future(),
        on_waitlist,
        canceled,
        confirmed_at: new Date(),
      });

      const attendee = new UserEventRole({
        userId: eventUsers[i].id,
        eventId: event.id,
        roleName: 'attendee',
        subscribed: true, // TODO: have some unsubscribed users
      });

      if (organizerIterator.next().value) {
        const organizer = new UserEventRole({
          userId: eventUsers[i].id,
          eventId: event.id,
          roleName: 'organizer',
          subscribed: true, // TODO: even organizers may wish to opt out of emails
        });
        userEventRoles.push(organizer);
      }

      rsvps.push(rsvp);
      userEventRoles.push(attendee);
    }
  }

  try {
    await Promise.all(rsvps.map((rsvp) => rsvp.save()));
  } catch (e) {
    console.error(e);
    throw new Error('Error seeding rsvps');
  }

  try {
    await Promise.all(
      userEventRoles.map((userEventRole) => userEventRole.save()),
    );
  } catch (e) {
    console.error(e);
    throw new Error('Error seeding user-event-roles');
  }

  return rsvps;
};

export default createRsvps;
