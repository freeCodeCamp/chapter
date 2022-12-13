import { calendar_v3, GaxiosPromise } from '@googleapis/calendar';

import { isProd, isTest } from '../config';
import { createCalendarApi, invalidateToken } from './InitGoogle';
interface CalendarData {
  summary: string;
  description: string;
}

const tokenErrors = [
  'Invalid Credentials',
  'invalid_grant',
  'No access, refresh token, API key or refresh handler callback is set.',
];

async function errorHandler(err: unknown) {
  if (err instanceof Error && tokenErrors.indexOf(err.message) !== -1) {
    console.error('Marking token as invalid');
    await invalidateToken();
    // TODO send email to users with GoogleAuthenticate permission
  }
}

async function wrapWithHandler<T>(func: GaxiosPromise<T>): GaxiosPromise<T> {
  try {
    return await func;
  } catch (err) {
    await errorHandler(err);
    throw err;
  }
}

export async function createCalendar({ summary, description }: CalendarData) {
  const calendarApi = await createCalendarApi();

  const { data } = await wrapWithHandler<calendar_v3.Schema$Calendar>(
    calendarApi.calendars.insert({
      requestBody: {
        summary,
        description,
      },
    }),
  );

  return data;
}

interface EventData {
  start?: Date;
  end?: Date;
  summary?: string;
  attendees?: calendar_v3.Schema$EventAttendee[];
  status?: 'cancelled';
}

function parseEventData({
  attendees,
  start,
  end,
  summary,
}: Partial<EventData>): calendar_v3.Schema$Event {
  return {
    ...(start && { start: { dateTime: start.toISOString() } }),
    ...(end && { end: { dateTime: end.toISOString() } }),
    ...(summary && { summary }),
    // Since Google will send emails to these addresses, we don't want to
    // accidentally send emails in testing.
    ...(attendees && { attendees: isProd() || isTest() ? attendees : [] }),
  };
}

function createEventRequestBody({
  attendees,
  start,
  end,
  summary,
}: EventData): calendar_v3.Schema$Event {
  return {
    ...parseEventData({ attendees, start, end, summary }),
    guestsCanSeeOtherGuests: false,
    guestsCanInviteOthers: false,
  };
}

interface CalendarId {
  calendarId: string;
}

export async function createCalendarEvent(
  { calendarId }: CalendarId,
  eventData: EventData,
) {
  const calendarApi = await createCalendarApi();

  const { data } = await wrapWithHandler<calendar_v3.Schema$Event>(
    calendarApi.events.insert({
      calendarId,
      sendUpdates: 'all',
      requestBody: createEventRequestBody(eventData),
    }),
  );
  return { calendarEventId: data.id };
}

interface EventIds {
  calendarId: string;
  calendarEventId: string;
}

async function getAndUpdateEvent(
  { calendarId, calendarEventId: eventId }: EventIds,
  update: EventData | null,
  updateAttendees?: (
    attendees?: calendar_v3.Schema$EventAttendee[],
  ) => calendar_v3.Schema$EventAttendee[] | undefined,
) {
  const calendarApi = await createCalendarApi();

  const { data } = await wrapWithHandler<calendar_v3.Schema$Event>(
    calendarApi.events.get({
      calendarId,
      eventId,
    }),
  );
  const { attendees } = data;

  const updatedAttendeesData = updateAttendees
    ? updateAttendees(attendees)
    : attendees;

  const requestBodyUpdates: EventData = {
    ...update,
    ...{ attendees: updatedAttendeesData },
  };

  return await wrapWithHandler<calendar_v3.Schema$Event>(
    calendarApi.events.update({
      calendarId,
      eventId,
      sendUpdates: 'all',
      requestBody: { ...data, ...createEventRequestBody(requestBodyUpdates) },
    }),
  );
}

// To be used to update event, but not the attendees.
export async function updateCalendarEvent(
  { calendarId, calendarEventId }: EventIds,
  eventUpdateData: EventData,
) {
  await getAndUpdateEvent({ calendarId, calendarEventId }, eventUpdateData);
}

function removeFromAttendees(email: string) {
  return (attendees: calendar_v3.Schema$EventAttendee[]) =>
    attendees.filter((attendee) => attendee.email !== email);
}

function addToAttendees(email: string) {
  return (attendees: calendar_v3.Schema$EventAttendee[] = []) =>
    attendees.concat({ email });
}

function cancelAttendance(email: string) {
  return (attendees: calendar_v3.Schema$EventAttendee[] = []) =>
    attendees.map((attendee) =>
      attendee.email === email
        ? { ...attendee, responseStatus: 'declined' }
        : attendee,
    );
}

interface Attendee {
  attendeeEmail: string;
}

export async function removeEventAttendee(
  { calendarId, calendarEventId }: EventIds,
  { attendeeEmail }: Attendee,
) {
  return await getAndUpdateEvent(
    { calendarId, calendarEventId },
    null,
    removeFromAttendees(attendeeEmail),
  );
}

export async function cancelEventAttendance(
  { calendarId, calendarEventId }: EventIds,
  { attendeeEmail }: Attendee,
) {
  return await getAndUpdateEvent(
    { calendarId, calendarEventId },
    null,
    cancelAttendance(attendeeEmail),
  );
}

export async function addEventAttendee(
  { calendarId, calendarEventId }: EventIds,
  { attendeeEmail }: Attendee,
) {
  return await getAndUpdateEvent(
    { calendarId, calendarEventId },
    null,
    addToAttendees(attendeeEmail),
  );
}

export async function deleteCalendarEvent({
  calendarId,
  calendarEventId: eventId,
}: EventIds) {
  const calendarApi = await createCalendarApi();

  await wrapWithHandler<void>(
    calendarApi.events.delete({
      calendarId,
      eventId,
      sendUpdates: 'all',
    }),
  );
}
