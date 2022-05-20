import { sub } from 'date-fns';

import { prisma } from '../../../src/prisma';
import { random, randomItems } from '../lib/random';
import { makeBooleanIterator } from '../lib/util';

const createRsvps = async (
  eventIds: number[],
  userIds: number[],
  eventRoles: Record<string, { name: string; id: number }>,
) => {
  const rsvpNames = ['yes', 'no', 'maybe', 'waitlist'];
  await prisma.rsvp.createMany({
    data: rsvpNames.map((rsvp) => ({ name: rsvp })),
  });

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
      const subscribed = true; // TODO: have some unsubscribed users
      const rsvpName = on_waitlist ? 'waitlist' : canceled ? 'no' : 'yes';

      await prisma.event_users.create({
        data: {
          event: { connect: { id: eventId } },
          user: { connect: { id: eventUserIds[i] } },
          event_role: {
            connect: {
              id: organizerIterator.next().value
                ? eventRoles.organizer.id
                : eventRoles.attendee.id,
            },
          },
          rsvp: {
            connect: {
              name: rsvpName,
            },
          },
          subscribed: subscribed,
        },
      });

      if (subscribed && rsvpName === 'yes') {
        const event = await prisma.events.findUnique({
          where: { id: eventId },
        });
        if (!event.canceled) {
          await prisma.event_reminders.create({
            data: {
              event_user: {
                connect: {
                  user_id_event_id: {
                    event_id: eventId,
                    user_id: eventUserIds[i],
                  },
                },
              },
              remind_at: sub(event.start_at, { days: 1 }),
            },
          });
        }
      }
    }
  }
};

export default createRsvps;
