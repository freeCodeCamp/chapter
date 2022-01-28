import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

import { random, randomItems } from '../lib/random';
import { makeBooleanIterator } from '../lib/util';
import { prisma } from 'src/prisma';

const { date } = faker;

const createRsvps = async (eventIds: number[], userIds: number[]) => {
  const rsvps: Prisma.rsvpsCreateManyInput[] = [];
  const userEventRoles: Prisma.user_event_rolesCreateManyInput[] = [];

  const eventIterator = makeBooleanIterator();
  for (const eventId of eventIds) {
    const eventUserIds = randomItems(userIds, userIds.length / 2);
    const numberWaiting = 1 + random(eventUserIds.length - 2);
    const numberCanceled = 1 + random(eventUserIds.length - numberWaiting - 1);

    // makes sure half of each event's users are organisers, but
    // alternates which half.
    const organizerIterator = makeBooleanIterator(eventIterator.next().value);

    for (let i = 0; i < eventUserIds.length; i++) {
      const on_waitlist = i < numberWaiting;
      const canceled = !on_waitlist && i < numberWaiting + numberCanceled;
      const rsvp = {
        event_id: eventId,
        user_id: eventUserIds[i],
        date: date.future(),
        on_waitlist,
        canceled,
        confirmed_at: new Date(),
      };

      const attendee = {
        user_id: eventUserIds[i],
        event_id: eventId,
        role_name: 'attendee',
        subscribed: true, // TODO: have some unsubscribed users
      };

      if (organizerIterator.next().value) {
        const organizer = {
          user_id: eventUserIds[i],
          event_id: eventId,
          role_name: 'organizer',
          subscribed: true, // TODO: even organizers may wish to opt out of emails
        };
        userEventRoles.push(organizer);
      }

      rsvps.push(rsvp);
      userEventRoles.push(attendee);
    }
  }

  try {
    await prisma.rsvps.createMany({ data: rsvps });
  } catch (e) {
    console.error(e);
    throw new Error('Error seeding rsvps');
  }

  try {
    await prisma.user_event_roles.createMany({ data: userEventRoles });
  } catch (e) {
    console.error(e);
    throw new Error('Error seeding user-event-roles');
  }
};

export default createRsvps;
