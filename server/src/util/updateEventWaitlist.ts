import { Prisma } from '@prisma/client';
import { sub } from 'date-fns';

import { prisma } from '../prisma';

import { createReminder } from '../services/Reminders';

type EventForWaitlistUpdate = Prisma.event_usersGetPayload<{
  include: {
    event: { include: { event_users: { include: { rsvp: true } } } };
  };
}>['event'];

export const updateEventWaitlist = async ({
  event: { capacity, event_users, invite_only, start_at },
  userId,
}: {
  event: EventForWaitlistUpdate;
  userId: number;
}) => {
  if (invite_only) return;

  const waitlist = event_users.filter(
    ({ user_id, rsvp: { name } }) => user_id !== userId && name === 'waitlist',
  );
  if (!waitlist.length) return;

  const attending = event_users.filter(
    ({ user_id, rsvp: { name } }) => user_id !== userId && name === 'yes',
  );
  if (capacity <= attending.length) return;

  const [userFromWaitlist] = waitlist;
  await prisma.event_users.update({
    data: { rsvp: { connect: { name: 'yes' } } },
    where: {
      user_id_event_id: {
        user_id: userFromWaitlist.user_id,
        event_id: userFromWaitlist.event_id,
      },
    },
  });

  // TODO add email about being off waitlist?

  if (userFromWaitlist.subscribed) {
    await createReminder({
      eventId: userFromWaitlist.event_id,
      remindAt: sub(start_at, { days: 1 }),
      userId: userFromWaitlist.user_id,
    });
  }
};
