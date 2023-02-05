import { events, events_venue_type_enum, Prisma, venues } from '@prisma/client';
import { CalendarEvent, google, outlook } from 'calendar-link';
import { isEqual } from 'date-fns';
import {
  chapterAdminUnsubscribeText,
  chapterUnsubscribeText,
  dateChangeText,
  eventAttendanceConfirmationText,
  eventCancelationText,
  eventConfirmAtendeeText,
  eventDescriptionText,
  eventInviteText,
  eventNewAttendeeNotificationText,
  eventUnsubscribeText,
  eventUpdateText,
  physicalLocationChangeText,
  physicalLocationShortText,
  SPACER,
  streamingUrlChangeText,
  streamingURLText,
  venueTypeChangeText,
} from '../email-templates';
import { generateToken, UnsubscribeType } from '../services/UnsubscribeToken';
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
  return chapterUnsubscribeText({ url });
};

export const eventUnsubscribeOptions = ({
  eventId,
  userId,
}: {
  eventId: number;
  userId: number;
}) => {
  const url = unsubscribeUrlFromToken(
    generateToken(UnsubscribeType.Event, eventId, userId),
  );
  return eventUnsubscribeText({ url });
};

export const chapterAdminUnsubscribeOptions = ({
  chapterId,
  userId,
}: {
  chapterId: number;
  userId: number;
}) => {
  const url = unsubscribeUrlFromToken(
    generateToken(UnsubscribeType.Chapter, chapterId, userId),
  );
  return chapterAdminUnsubscribeText({ url });
};

type EventInvite = Prisma.eventsGetPayload<{
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

export const eventInviteEmail = (event: EventInvite) => {
  const physicalLocation = isPhysical(event.venue_type)
    ? physicalLocationShortText(event.venue?.name)
    : '';
  const streamingData = isOnline(event.venue_type)
    ? streamingURLText(event.streaming_url)
    : '';
  const chapterURL = chapterUrl(event.chapter_id);
  const chapterName = event.chapter.name;
  const eventConfirmAttendanceURL = `${eventUrl(
    event.id,
  )}?confirm_attendance=true`;
  const description = event.description
    ? eventDescriptionText(event.description)
    : '';

  return withUnsubscribe(
    eventInviteText({
      chapterName,
      chapterURL,
      description,
      ends_at: event.ends_at,
      eventConfirmAttendanceURL,
      eventName: event.name,
      physicalLocation,
      start_at: event.start_at,
      streamingData,
    }),
  );
};

type CancelEvent = Prisma.eventsGetPayload<{
  include: { chapter: { select: { id: true; name: true } } };
}>;

export const eventCancelationEmail = (event: CancelEvent) => {
  const eventName = event.name;
  const chapterName = event.chapter.name;
  const chapterURL = chapterUrl(event.chapter.id);

  return withUnsubscribe(
    eventCancelationText({ chapterName, chapterURL, eventName }),
  );
};

export const eventConfirmAttendeeEmail = (eventName: string) =>
  withUnsubscribe(eventConfirmAtendeeText({ eventName }));

export const eventNewAttendeeNotifyEmail = ({
  eventName,
  userName,
}: {
  eventName: string;
  userName: string;
}) =>
  withUnsubscribe(eventNewAttendeeNotificationText({ eventName, userName }));

interface AttendanceConfirmation {
  event: events & { venue: venues | null };
  userName: string;
}

export const eventAttendanceConfirmation = ({
  event,
  userName,
}: AttendanceConfirmation) => {
  const linkDetails: CalendarEvent = {
    title: event.name,
    start: event.start_at,
    end: event.ends_at,
    description: event.description,
  };
  if (event.venue?.name) linkDetails.location = event.venue?.name;

  const eventName = event.name;
  const googleURL = google(linkDetails);
  const outlookURL = outlook(linkDetails);
  return withUnsubscribe(
    eventAttendanceConfirmationText({
      eventName,
      googleURL,
      outlookURL,
      userName: userName ? ` ${userName}` : '',
    }),
  );
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

export const buildEmailForUpdatedEvent = (
  newData: UpdateEmailData,
  oldData: UpdateEmailData,
) => {
  const venueTypeChange = hasVenueTypeChanged(newData, oldData)
    ? `${venueTypeChangeText({
        newVenueType: newData.venue_type,
        oldVenueType: oldData.venue_type,
      })}${SPACER}`
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

  return withUnsubscribe(
    eventUpdateText({
      dateChange,
      eventName: oldData.name,
      physicalLocationChange,
      streamingUrlChange,
      venueTypeChange,
    }),
  );
};
