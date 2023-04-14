import { events, events_venue_type_enum, venues } from '@prisma/client';
import { CalendarEvent, google, outlook } from 'calendar-link';
import { isEqual } from 'date-fns';
import {
  chapterAdminUnsubscribeText,
  chapterUnsubscribeText,
  dateChangeText,
  eventAttendanceCancelationText,
  eventAttendanceConfirmationText,
  eventAttendanceRequestText,
  eventAttendeeToWaitlistText,
  eventCancelationText,
  eventConfirmAtendeeText,
  eventDescriptionText,
  eventInviteText,
  eventListUnsubscribeText,
  eventNewAttendeeNotificationText,
  eventUnsubscribeText,
  eventUpdateText,
  eventWaitlistConfirmationText,
  physicalLocationChangeText,
  physicalLocationShortText,
  SPACER,
  streamingUrlChangeText,
  streamingURLText,
  venueTypeChangeText,
} from '../email-templates';
import mailerService from '../services/MailerService';
import { generateToken, UnsubscribeType } from '../services/UnsubscribeToken';
import { isOnline, isPhysical } from './venue';

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

export const getPhysicalLocation = (
  venue_type: events_venue_type_enum,
  venue_name: string | undefined,
) =>
  isPhysical(venue_type) ? `\n${physicalLocationShortText(venue_name)}` : '';

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

export const getStreamingData = (
  venue_type: events_venue_type_enum,
  streaming_url: string | null,
) => (isOnline(venue_type) ? `\n${streamingURLText(streaming_url)}` : '');

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

export const eventListUnsubscribeOptions = ({
  eventId,
  userId,
}: {
  eventId: number;
  userId: number;
}) => {
  const url = unsubscribeUrlFromToken(
    generateToken(UnsubscribeType.Event, eventId, userId),
  );
  return eventListUnsubscribeText({ url });
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

export type AttachUnsubscribeData = {
  (options: { chapterId: number; eventId: number; userId: number }): string;
  (options: { chapterId: number; eventId?: never; userId: number }): string;
  (options: { chapterId?: never; eventId: number; userId: number }): string;
};

const attachUnsubscribe = (emailText: string) => {
  return <AttachUnsubscribeData>(({ chapterId, eventId, userId }) => {
    const chapterUnsubscribe =
      chapterId && userId
        ? `\n<br />${chapterUnsubscribeOptions({ chapterId, userId })}`
        : '';
    const eventUnsubscribe =
      eventId && userId
        ? `\n<br />${eventUnsubscribeOptions({ eventId, userId })}`
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

interface EventInvite {
  chapter: { id: number; name: string };
  chapter_id: number;
  description: string;
  ends_at: Date;
  id: number;
  name: string;
  start_at: Date;
  streaming_url: string | null;
  venue: { name: string | undefined } | null;
  venue_type: events_venue_type_enum;
}

export const eventInviteEmail = (event: EventInvite) => {
  const physicalLocation = getPhysicalLocation(
    event.venue_type,
    event.venue?.name,
  );
  const streamingData = getStreamingData(event.venue_type, event.streaming_url);
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

interface CancelEvent {
  name: string;
  chapter: { id: number; name: string };
}

export const eventCancelationEmail = (event: CancelEvent) => {
  const eventName = event.name;
  const chapterName = event.chapter.name;
  const chapterURL = chapterUrl(event.chapter.id);

  return withUnsubscribe(
    eventCancelationText({ chapterName, chapterURL, eventName }),
  );
};

interface ConfirmAttendeeData {
  name: string;
  streaming_url: string | null;
  venue: { name: string | undefined } | null;
  venue_type: events_venue_type_enum;
  start_at: Date;
  ends_at: Date;
}

export const eventConfirmAttendeeEmail = (event: ConfirmAttendeeData) => {
  const physicalLocation = getPhysicalLocation(
    event.venue_type,
    event.venue?.name,
  );
  const streamingData = getStreamingData(event.venue_type, event.streaming_url);
  const eventName = event.name;
  return withUnsubscribe(
    eventConfirmAtendeeText({
      eventName,
      physicalLocation,
      streamingData,
      start_at: event.start_at,
      ends_at: event.ends_at,
    }),
  );
};

export const eventAttendeeToWaitlistEmail = (eventName: string) =>
  withUnsubscribe(eventAttendeeToWaitlistText({ eventName }));

export const eventNewAttendeeNotifyEmail = ({
  eventName,
  userName,
}: {
  eventName: string;
  userName: string;
}) =>
  withUnsubscribe(eventNewAttendeeNotificationText({ eventName, userName }));

interface AttendanceConfirmation {
  event: {
    name: string;
    start_at: Date;
    ends_at: Date;
    description: string;
    streaming_url: string | null;
    venue: { name: string | undefined } | null;
    venue_type: events_venue_type_enum;
  };
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

  const physicalLocation = getPhysicalLocation(
    event.venue_type,
    event.venue?.name,
  );
  const streamingData = getStreamingData(event.venue_type, event.streaming_url);

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
      physicalLocation,
      streamingData,
      start_at: event.start_at,
      ends_at: event.ends_at,
    }),
  );
};

interface WaitlistConfirmation {
  event: { name: string };
  userName: string;
}

export const eventWaitlistConfirmation = ({
  event,
  userName,
}: WaitlistConfirmation) =>
  withUnsubscribe(
    eventWaitlistConfirmationText({
      eventName: event.name,
      userName: userName ? ` ${userName}` : '',
    }),
  );

interface AttendanceRequest {
  event: { name: string };
  userName: string;
}

export const eventAttendanceRequest = ({
  event,
  userName,
}: AttendanceRequest) =>
  withUnsubscribe(
    eventAttendanceRequestText({
      eventName: event.name,
      userName: userName ? ` ${userName}` : '',
    }),
  );

interface AttendanceCancelation {
  event: { name: string };
  userName: string;
}

export const eventAttendanceCancelation = ({
  event,
  userName,
}: AttendanceCancelation) => {
  const eventName = event.name;
  return withUnsubscribe(
    eventAttendanceCancelationText({
      eventName,
      userName: userName ? ` ${userName}` : '',
    }),
  );
};

interface UpdateEmailData {
  ends_at: Date;
  name: string;
  start_at: Date;
  streaming_url?: string | null;
  venue: {
    name: string;
    street_address: string | null;
    city: string;
    region: string;
    postal_code: string;
  } | null;
  venue_id: number | null;
  venue_type: events_venue_type_enum;
}

export const buildEmailForUpdatedEvent = ({
  newData,
  oldData,
}: {
  newData: UpdateEmailData;
  oldData: UpdateEmailData;
}) => {
  const venueTypeChange = hasVenueTypeChanged(newData, oldData)
    ? `\n${venueTypeChangeText({
        newVenueType: newData.venue_type,
        oldVenueType: oldData.venue_type,
      })}${SPACER}`
    : '';
  const physicalLocationChange =
    hasPhysicalLocationChanged(newData, oldData) &&
    isPhysical(newData.venue_type)
      ? `\n${physicalLocationChangeText(newData)}${SPACER}`
      : '';
  const streamingUrlChange =
    hasStreamingUrlChanged(newData, oldData) && isOnline(newData.venue_type)
      ? `\n${streamingUrlChangeText(newData)}${SPACER}`
      : '';
  const dateChange = hasDateChanged(newData, oldData)
    ? `\n${dateChangeText(newData)}${SPACER}`
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

interface UserEmail {
  emailData: ({
    event,
    userName,
  }: {
    event: events & { venue: venues | null };
    userName: string;
  }) => {
    subject: string;
    attachUnsubscribe: AttachUnsubscribeData;
  };
  event: events & { venue: venues | null };
  user: { email: string; id: number; name: string };
}

export const sendUserEmail = async ({ emailData, event, user }: UserEmail) => {
  const { subject, attachUnsubscribe } = emailData({
    event,
    userName: user.name,
  });

  await mailerService.sendEmail({
    emailList: [user.email],
    subject,
    htmlEmail: attachUnsubscribe({
      chapterId: event.chapter_id,
      eventId: event.id,
      userId: user.id,
    }),
  });
};
