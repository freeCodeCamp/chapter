import { events, Prisma, venues } from '@prisma/client';
import { CalendarEvent, google, outlook } from 'calendar-link';
import { isEqual } from 'date-fns';
import { EventInputs } from '../controllers/Events/inputs';
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
  return `<br />
  - To stop receiving notifications about new events in this chapter, <a href="${url}">unsubscribe here</a>.`;
};

export const eventUnsubscribeOptions = ({
  chapterId,
  eventId,
  userId,
}: {
  chapterId: number;
  eventId: number;
  userId: number;
}) => {
  const eventUnsubscribeToken = generateToken(
    UnsubscribeType.Event,
    eventId,
    userId,
  );
  const linkForEvent = unsubscribeUrlFromToken(eventUnsubscribeToken);
  const chapterUnsubscribe = chapterUnsubscribeOptions({ chapterId, userId });
  return `<br />
  - To stop receiving notifications about this event, <a href="${linkForEvent}">unsubscribe here</a>.${chapterUnsubscribe}`;
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
  return `<br /><a href="${unsubscribeUrlFromToken(
    chapterUnsubscribeToken,
  )}">Unsubscribe from chapter emails</a>`;
};

type InviteEvent = Prisma.eventsGetPayload<{
  include: {
    venue: true;
    chapter: true;
  };
}>;

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

  return { subject, emailText };
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

  return { subject, emailText };
};

export const eventAttendanceConfirmEmail = (eventName: string) => {
  const subject = 'Your attendance is confirmed';
  const emailText = `Your reservation is confirmed. You can attend the event ${eventName}`;
  return { subject, emailText };
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
  return { subject, emailText };
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

  return { subject, emailText };
};

const hasVenueLocationChanged = (data: EventInputs, event: EventWithUsers) =>
  data.venue_type !== event.venue_type ||
  (isPhysical(event.venue_type) && data.venue_id !== event.venue_id);
const hasDateChanged = (data: EventInputs, event: EventWithUsers) =>
  !isEqual(data.ends_at, event.ends_at) ||
  !isEqual(data.start_at, event.start_at);
const hasStreamingUrlChanged = (data: EventInputs, event: EventWithUsers) =>
  data.venue_type !== event.venue_type ||
  (isOnline(event.venue_type) && data.streaming_url !== event.streaming_url);

interface UpdatedEvent {
  venue: venues | null;
  venue_id: number | null;
}

export const buildEmailForUpdatedEvent = async (
  data: EventInputs,
  event: EventWithUsers,
  updatedEvent: UpdatedEvent,
) => {
  const subject = `Details changed for event ${event.name}`;

  const createVenueLocationContent = async () => {
    if (!updatedEvent.venue_id || !updatedEvent.venue)
      return `Location of event is currently ${TBD}.${SPACER}`;

    // TODO: include a link back to the venue page
    return `The event is now being held at <br />
    <br />
- ${updatedEvent.venue.name} <br />
- ${
      updatedEvent.venue.street_address
        ? updatedEvent.venue.street_address + '<br />- '
        : ''
    }
${updatedEvent.venue.city} <br />
- ${updatedEvent.venue.region} <br />
- ${updatedEvent.venue.postal_code} ${SPACER}`;
  };
  const createDateUpdates = () => {
    return `
- Start: ${formatDate(data.start_at)}<br />
- End: ${formatDate(data.ends_at)}${SPACER}`;
  };
  const createStreamUpdate = () => {
    return `Streaming URL: ${data.streaming_url || TBD}${SPACER}`;
  };

  const streamingUrl =
    hasStreamingUrlChanged(data, event) && isOnline(data.venue_type)
      ? createStreamUpdate()
      : '';
  const venueLocationChange =
    hasVenueLocationChanged(data, event) && isPhysical(data.venue_type)
      ? await createVenueLocationContent()
      : '';
  const dateChange = hasDateChanged(data, event) ? createDateUpdates() : '';

  const body = `Updated venue details<br/>
${venueLocationChange}
${streamingUrl}
${dateChange}
`;
  return { subject, body };
};
