import { inspect } from 'util';

import { prisma } from '../prisma';
import { Event } from '../graphql-types';
import {
  createCalendarEvent as createCalendarEventService,
  patchCalendarEvent,
} from '../services/Google';
import { redactSecrets } from './redact-secrets';

export const updateCalendarEventAttendees = async ({
  eventId,
  calendarId,
  calendarEventId,
}: {
  eventId: number;
  calendarId: string | null;
  calendarEventId: string | null;
}) => {
  const attendees = await prisma.event_users.findMany({
    where: {
      event_id: eventId,
      rsvp: { name: 'yes' },
    },
    select: { user: { select: { email: true } } },
  });

  if (calendarId && calendarEventId) {
    try {
      // Patch is necessary here, since an update with unchanged start and end
      // will remove attendees' yes/no/maybe response without notifying them.
      await patchCalendarEvent({
        calendarId,
        calendarEventId,
        attendeeEmails: attendees.map(({ user }) => user.email),
      });
    } catch (e) {
      console.log('Unable to update calendar event attendees');
      console.error(inspect(redactSecrets(e), { depth: null }));
    }
  }
};

interface CreateCalendarEventData {
  attendeeEmails: string[];
  calendarId: string;
  event: Pick<Event, 'id' | 'ends_at' | 'start_at' | 'name'>;
}

export const createCalendarEvent = async ({
  attendeeEmails,
  calendarId,
  event: { ends_at, id, name, start_at },
}: CreateCalendarEventData) => {
  try {
    const { calendarEventId } = await createCalendarEventService({
      calendarId,
      start: start_at,
      end: ends_at,
      summary: name,
      attendeeEmails,
    });

    return await prisma.events.update({
      where: { id },
      data: { calendar_event_id: calendarEventId },
    });
  } catch (e) {
    console.error('Unable to create calendar event');
    console.error(inspect(redactSecrets(e), { depth: null }));
  }
};

export const integrationStatus = async () => {
  const tokens = await prisma.google_tokens.findMany();
  if (!tokens.length) return false;
  return tokens.some(({ is_valid }) => is_valid) ? true : null;
};
