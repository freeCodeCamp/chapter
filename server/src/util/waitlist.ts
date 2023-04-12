import { inspect } from 'util';
import { Prisma } from '@prisma/client';
import { sub } from 'date-fns';
import { AttendanceNames } from '../../../common/attendance';

import { prisma } from '../prisma';
import { addEventAttendee } from '../services/Google';

import { createReminder } from '../services/Reminders';
import { integrationStatus } from './calendar';
import { redactSecrets } from './redact-secrets';
import { eventAttendanceConfirmation, sendUserEmail } from './event-email';

type EventForWaitlistUpdate = Prisma.event_usersGetPayload<{
  include: {
    event: {
      include: {
        event_users: { include: { attendance: true; user: true } };
        chapter: { select: { calendar_id: true } };
        venue: true;
      };
    };
  };
}>['event'];

export const updateWaitlistForUserRemoval = async ({
  event,
  userId,
}: {
  event: EventForWaitlistUpdate;
  userId: number;
}) => {
  const {
    calendar_event_id,
    capacity,
    chapter: { calendar_id },
    event_users,
    invite_only,
    start_at,
  } = event;
  if (invite_only) return;

  // Since updateWaitlistForUserRemoval gets the original event_users before the
  // user was removed, we have to filter them out here.
  const waitlist = event_users.filter(
    ({ attendance: { name }, user_id }) =>
      user_id !== userId && name === AttendanceNames.waitlist,
  );
  if (!waitlist.length) return;

  const attendees = event_users.filter(
    ({ user_id, attendance: { name } }) =>
      user_id !== userId && name === AttendanceNames.confirmed,
  );
  if (capacity <= attendees.length) return;

  const [newAttendee] = waitlist;
  await prisma.event_users.update({
    data: { attendance: { connect: { name: AttendanceNames.confirmed } } },
    where: {
      user_id_event_id: {
        user_id: newAttendee.user_id,
        event_id: newAttendee.event_id,
      },
    },
  });

  await sendUserEmail({
    emailData: eventAttendanceConfirmation,
    event,
    user: newAttendee.user,
  });

  if (newAttendee.subscribed) {
    await createReminder({
      eventId: newAttendee.event_id,
      remindAt: sub(start_at, { days: 1 }),
      userId: newAttendee.user_id,
    });
  }

  if (calendar_event_id && calendar_id && (await integrationStatus())) {
    try {
      await addEventAttendee(
        { calendarId: calendar_id, calendarEventId: calendar_event_id },
        { attendeeEmail: newAttendee.user.email },
      );
    } catch (e) {
      console.error('Unable to confirm attendance at calendar event');
      console.error(inspect(redactSecrets(e), { depth: null }));
    }
  }
};
