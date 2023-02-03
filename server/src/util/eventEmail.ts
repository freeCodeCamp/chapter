import { events, events_venue_type_enum, Prisma, venues } from '@prisma/client';
import { CalendarEvent, google, outlook } from 'calendar-link';
import { isEqual } from 'date-fns';
import { generateToken, UnsubscribeType } from '../services/UnsubscribeToken';
import { formatDate } from './date';
import { isOnline, isPhysical } from './venue';

export type EventWithUsers = Prisma.eventsGetPayload<{
  include: {
    venue: true;
    sponsors: true;
    event_users: {
      include: { user: true; event_reminder: true };
      where: { subscribed: true };
    };
  };
}>;

const SPACER = `<br />
----------------------------<br />
<br />
`;
const TBD = 'Undecided/TBD';

const chapterUrl = (id: number) =>
  `${process.env.CLIENT_LOCATION}/chapters/${id}`;
const eventUrl = (id: number) => `${process.env.CLIENT_LOCATION}/events/${id}`;
const unsubscribeUrlFromToken = (token: string) =>
  `${process.env.CLIENT_LOCATION}/unsubscribe?token=${token}`;

interface PhysicalLocationChangeData {
  venue_type: events_venue_type_enum;
  venue_id: number | null;
}

export const hasPhysicalLocationChanged = (
  newData: PhysicalLocationChangeData,
  oldData: PhysicalLocationChangeData,
) =>
  newData.venue_type !== oldData.venue_type ||
  (isPhysical(oldData.venue_type) && newData.venue_id !== oldData.venue_id);

interface DateChangeData {
  start_at: Date;
  ends_at: Date;
}

export const hasDateChanged = (
  newData: DateChangeData,
  oldData: DateChangeData,
) =>
  !isEqual(newData.ends_at, oldData.ends_at) ||
  !isEqual(newData.start_at, oldData.start_at);

interface StreamingUrlChangeData {
  streaming_url?: string | null;
  venue_type: events_venue_type_enum;
}

export const hasStreamingUrlChanged = (
  newData: StreamingUrlChangeData,
  oldData: StreamingUrlChangeData,
) =>
  newData.venue_type !== oldData.venue_type ||
  (isOnline(oldData.venue_type) &&
    newData.streaming_url !== oldData.streaming_url);

interface VenueTypeChangeData {
  venue_type: events_venue_type_enum;
}

export const hasVenueTypeChanged = (
  newData: VenueTypeChangeData,
  oldData: VenueTypeChangeData,
) => newData.venue_type !== oldData.venue_type;

export const chapterUnsubscribeOptions = ({
  chapterId,
  userId,
}: {
  chapterId: number;
  userId: number;
}) => {
  const url = unsubscribeUrlFromToken(
    generateToken(UnsubscribeType.Chapter, chapterId, userId),
  );
  return `- To stop receiving notifications about new events in this chapter, <a href="${url}">unsubscribe here</a>.`;
};

export const eventUnsubscribeOptions = ({
  eventId,
  userId,
}: {
  eventId: number;
  userId: number;
}) => {
  const eventUnsubscribeToken = generateToken(
    UnsubscribeType.Event,
    eventId,
    userId,
  );
  const url = unsubscribeUrlFromToken(eventUnsubscribeToken);
  return `- To stop receiving notifications about this event, <a href="${url}">unsubscribe here</a>.`;
};

export const chapterAdminUnsubscribeOptions = ({
  chapterId,
  userId,
}: {
  chapterId: number;
  userId: number;
}) => {
  const chapterUnsubscribeToken = generateToken(
    UnsubscribeType.Chapter,
    chapterId,
    userId,
  );
  return `<a href="${unsubscribeUrlFromToken(
    chapterUnsubscribeToken,
  )}">Unsubscribe from chapter emails</a>`;
};

type InviteEvent = Prisma.eventsGetPayload<{
  include: {
    venue: true;
    chapter: true;
  };
}>;

export type AttachUnsubscribeData = {
  (options: { chapterId: number; eventId: number; userId: number }): string;
  (options: { chapterId: number; eventId?: never; userId: number }): string;
  (options: { chapterId?: never; eventId: number; userId: number }): string;
};

const attachUnsubscribe = (emailText: string) => {
  return <AttachUnsubscribeData>(({ chapterId, eventId, userId }) => {
    const chapterUnsubscribe =
      chapterId && userId
        ? `<br />${chapterUnsubscribeOptions({ chapterId, userId })}`
        : '';
    const eventUnsubscribe =
      eventId && userId
        ? `<br />${eventUnsubscribeOptions({ eventId, userId })}`
        : '';

    return `${emailText}<br />${eventUnsubscribe}${chapterUnsubscribe}<br />`;
  });
};

const attachUnsubscribeText = (emailText: string) => {
  return (unsubscribeText: string) => `${emailText}<br />${unsubscribeText}`;
};

const withUnsubscribe = ({
  subject,
  emailText,
}: {
  subject: string;
  emailText: string;
}) => ({
  subject,
  emailText,
  attachUnsubscribe: attachUnsubscribe(emailText),
  attachUnsubscribeText: attachUnsubscribeText(emailText),
});

export const eventInviteEmail = (event: InviteEvent) => {
  const physicalLocation = isPhysical(event.venue_type)
    ? `Where: ${event.venue?.name || TBD}<br />`
    : '';
  const streamingUrl = isOnline(event.venue_type)
    ? `Streaming URL: ${event.streaming_url || TBD}<br />`
    : '';
  const chapterURL = chapterUrl(event.chapter_id);
  const chapterName = event.chapter.name;
  const eventURL = eventUrl(event.id);
  const confirmRsvpQuery = '?confirm_attendance=true';
  const description = event.description
    ? `About the event: <br />
    ${event.description}${SPACER}`
    : '';

  const subject = `Invitation to ${event.name}.`;
  const emailText = `Upcoming event for ${chapterName}.<br />
<br />
When: ${event.start_at} to ${event.ends_at}
<br />${physicalLocation}${streamingUrl}
<br />
Go to <a href="${eventURL}${confirmRsvpQuery}">the event page</a> to confirm your attendance.${SPACER}
${description}
View all upcoming events for ${chapterName}: <a href='${chapterURL}'>${chapterName} chapter</a>.<br />
<br />`;

  return withUnsubscribe({
    subject,
    emailText,
  });
};

type CancelEvent = Prisma.eventsGetPayload<{
  include: { chapter: { select: { id: true; name: true } } };
}>;

export const eventCancelationEmail = (event: CancelEvent) => {
  const eventName = event.name;
  const chapterName = event.chapter.name;

  const subject = `Event ${eventName} is canceled`;
  const emailText = `The upcoming event ${eventName} has been canceled.<br />
<br />
View upcoming events for ${chapterName}: <a href='${process.env.CLIENT_LOCATION}/chapters/${event.chapter.id}'>${chapterName} chapter</a>.<br />
You received this email because you Subscribed to ${eventName} Event.<br />`;

  return withUnsubscribe({
    subject,
    emailText,
  });
};

export const eventAttendanceConfirmEmail = (eventName: string) => {
  const subject = 'Your attendance is confirmed';
  const emailText = `Your reservation is confirmed. You can attend the event ${eventName}`;
  return withUnsubscribe({
    subject,
    emailText,
  });
};

export const eventRsvpNotifyEmail = ({
  eventName,
  userName,
}: {
  eventName: string;
  userName: string;
}) => {
  const subject = `New attendee for ${eventName}`;
  const emailText = `User ${userName} is attending.`;
  return withUnsubscribe({
    subject,
    emailText,
  });
};

interface RsvpConfirmation {
  event: events & { venue: venues | null };
  userName: string;
}

export const eventRsvpConfirmation = ({
  event,
  userName,
}: RsvpConfirmation) => {
  const subject = `Confirmation of attendance: ${event.name}`;

  const linkDetails: CalendarEvent = {
    title: event.name,
    start: event.start_at,
    end: event.ends_at,
    description: event.description,
  };
  if (event.venue?.name) linkDetails.location = event.venue?.name;

  const emailText = `Hi${userName ? ' ' + userName : ''},<br>
You should receive a calendar invite shortly. If you do not, you can add the event to your calendars by clicking on the links below:<br />
<br />
<a href=${google(linkDetails)}>Google</a>
<br />
<a href=${outlook(linkDetails)}>Outlook</a>`;

  return withUnsubscribe({
    subject,
    emailText,
  });
};

interface UpdateEmailData {
  ends_at: Date;
  name: string;
  start_at: Date;
  streaming_url?: string | null;
  venue: venues | null;
  venue_id: number | null;
  venue_type: events_venue_type_enum;
}

const venueTypeChangeText = (
  oldData: VenueTypeChangeData,
  newData: VenueTypeChangeData,
) => {
  switch (oldData.venue_type) {
    case events_venue_type_enum.Online:
      switch (newData.venue_type) {
        case events_venue_type_enum.Physical:
          return 'Event was online-only, but now it will be in-person only. It will no longer be possible to attend online.';
        case events_venue_type_enum.PhysicalAndOnline:
          return 'Event was online-only, but now it will be held also in-person. Online attendees are still welcome.';
      }
      break;
    case events_venue_type_enum.Physical:
      switch (newData.venue_type) {
        case events_venue_type_enum.Online:
          return 'Event was in-person only, but now it will be online-only. It will no longer be possible to attend in-person.';
        case events_venue_type_enum.PhysicalAndOnline:
          return 'Event was online-only, but now it will be held also in -person. Online attendees are still welcome.';
      }
      break;
    case events_venue_type_enum.PhysicalAndOnline:
      switch (newData.venue_type) {
        case events_venue_type_enum.Online:
          return 'Event was being held in-person and online, but now it will be online-only. It will no longer be possible to attend in-person. Online attendees are still welcome.';
        case events_venue_type_enum.Physical:
          return 'Event was being held in-person and online, but now it will be in-person only. It will no longer be possible to attend online. In-person attendees are still welcome.';
      }
  }
  return null;
};

interface PhysicalLocationTextData {
  venue: venues | null;
  venue_id: number | null;
}

const physicalLocationChangeText = ({
  venue,
  venue_id,
}: PhysicalLocationTextData) => {
  if (!venue_id || !venue) return `Location of event is currently ${TBD}.`;

  // TODO: include a link back to the venue page
  return `The event is now being held at <br />
<br />
- ${venue.name} <br />
${venue.street_address ? `- ${venue.street_address} <br />` : ''}
${venue.city} <br />
- ${venue.region} <br />
- ${venue.postal_code}`;
};

const dateChangeText = ({ ends_at, start_at }: DateChangeData) => {
  return `
- Start: ${formatDate(start_at)}<br />
- End: ${formatDate(ends_at)}`;
};

const streamingUrlChangeText = ({
  streaming_url,
}: {
  streaming_url?: string | null;
}) => {
  return `Streaming URL: ${streaming_url || TBD}`;
};

export const buildEmailForUpdatedEvent = (
  newData: UpdateEmailData,
  oldData: UpdateEmailData,
) => {
  const subject = `Details changed for event ${oldData.name}`;

  const venueTypeChange = hasVenueTypeChanged(newData, oldData)
    ? `${venueTypeChangeText(newData, oldData)}${SPACER}`
    : '';
  const physicalLocationChange =
    hasPhysicalLocationChanged(newData, oldData) &&
    isPhysical(newData.venue_type)
      ? `${physicalLocationChangeText(newData)}${SPACER}`
      : '';
  const streamingUrlChange =
    hasStreamingUrlChanged(newData, oldData) && isOnline(newData.venue_type)
      ? `${streamingUrlChangeText(newData)}${SPACER}`
      : '';
  const dateChange = hasDateChanged(newData, oldData)
    ? `${dateChangeText(newData)}${SPACER}`
    : '';

  const emailText = `Updated venue details<br/>${venueTypeChange}${physicalLocationChange}${streamingUrlChange}${dateChange}`;
  return withUnsubscribe({ subject, emailText });
};
