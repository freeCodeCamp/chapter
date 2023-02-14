import { inspect } from 'util';

import { Permission } from '../../../common/permissions';
import { prisma } from '../prisma';
import { Event } from '../graphql-types';
import { createCalendarEvent } from '../services/Google';
import mailerService from '../services/MailerService';
import { invalidTokenNotification } from '../email-templates';
import { redactSecrets } from './redact-secrets';
import { isOnline } from './venue';

interface CreateCalendarEventData {
  attendeeEmails: string[];
  calendarId: string;
  event: Pick<Event, 'id' | 'ends_at' | 'name' | 'start_at' | 'venue_type'>;
}

// TODO: consider pulling this back into the resolver (it's only used twice,
// it's not that complex so I don't think we need to abstract it out)
export const createCalendarEventHelper = async ({
  attendeeEmails,
  calendarId,
  event: { ends_at, id, name, start_at, venue_type },
}: CreateCalendarEventData) => {
  try {
    const { calendarEventId } = await createCalendarEvent(
      {
        calendarId,
      },
      {
        start: start_at,
        end: ends_at,
        summary: name,
        attendees: attendeeEmails.map((email) => ({ email })),
        createMeet: isOnline(venue_type),
      },
    );

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

export const sendInvalidTokenNotification = async () => {
  const users = await prisma.users.findMany({
    where: {
      instance_role: {
        instance_role_permissions: {
          some: {
            instance_permission: {
              name: Permission.GoogleAuthenticate,
            },
          },
        },
      },
    },
  });

  const emailList = users.map(({ email }) => email);
  const { subject, emailText } = invalidTokenNotification();
  await mailerService.sendEmail({
    emailList,
    subject,
    htmlEmail: emailText,
  });
};
