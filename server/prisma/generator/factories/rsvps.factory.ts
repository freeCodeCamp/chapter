import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

import { sub } from 'date-fns';

import { prisma } from '../../../src/prisma';
import { random, randomItems } from '../lib/random';
import { makeBooleanIterator } from '../lib/util';

const { date } = faker;

const createRsvps = async (eventIds: number[], userIds: number[]) => {
  const rsvps: Prisma.rsvpsCreateManyInput[] = [];
  const userEventRoles: Prisma.user_event_rolesCreateManyInput[] = [];
  const eventReminders: Prisma.event_remindersCreateManyInput[] = [];

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

      const role = {
        user_id: eventUserIds[i],
        event_id: eventId,
        role_name: organizerIterator.next().value ? 'organizer' : 'attendee',
        subscribed: true, // TODO: have some unsubscribed users
      };

      if (role.subscribed && !rsvp.on_waitlist && !rsvp.canceled) {
        const event = await prisma.events.findUnique({
          where: { id: eventId },
        });
        if (!event.canceled) {
          const reminder = {
            event_id: eventId,
            user_id: eventUserIds[i],
            notifying: false,
            remind_at: sub(event.start_at, { days: 1 }),
          };
          eventReminders.push(reminder);
        }
      }

      rsvps.push(rsvp);
      userEventRoles.push(role);
    }
  }

  try {
    await prisma.rsvps.createMany({ data: rsvps });
  } catch (e) {
    console.error(e);
    throw new Error('Error seeding rsvps');
  }

  try {
    await prisma.event_reminders.createMany({ data: eventReminders });
  } catch (e) {
    console.error(e);
    throw new Error('Error seeding event reminders');
  }

  try {
    await prisma.user_event_roles.createMany({ data: userEventRoles });
  } catch (e) {
    console.error(e);
    throw new Error('Error seeding user-event-roles');
  }
};

export default createRsvps;
