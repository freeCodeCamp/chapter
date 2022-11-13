import { Prisma } from '@prisma/client';
import { sub } from 'date-fns';

import { prisma } from '../prisma';

import { createReminder } from '../services/Reminders';

type EventForWaitlistUpdate = Prisma.event_usersGetPayload<{
  include: {
    event: { include: { event_users: { include: { rsvp: true } } } };
  };
}>['event'];

export const updateWaitlistForUserRemoval = async ({
  event: { capacity, event_users, invite_only, start_at },
  userId,
}: {
  event: EventForWaitlistUpdate;
  userId: number;
}) => {
  if (invite_only) return;

  // Since updateWaitlistForUserRemoval gets the original event_users before the
  // user was removed, we have to filter them out here.
  const waitlist = event_users.filter(
    ({ user_id, rsvp: { name } }) => user_id !== userId && name === 'waitlist',
  );
  if (!waitlist.length) return;

  const attendees = event_users.filter(
    ({ user_id, rsvp: { name } }) => user_id !== userId && name === 'yes',
  );
  if (capacity <= attendees.length) return;

  const [newAttendee] = waitlist;
  await prisma.event_users.update({
    data: { rsvp: { connect: { name: 'yes' } } },
    where: {
      user_id_event_id: {
        user_id: newAttendee.user_id,
        event_id: newAttendee.event_id,
      },
    },
  });

  // TODO add email about being off waitlist?

  if (newAttendee.subscribed) {
    await createReminder({
      eventId: newAttendee.event_id,
      remindAt: sub(start_at, { days: 1 }),
      userId: newAttendee.user_id,
    });
  }
};
