import type { calendar_v3 } from '@googleapis/calendar';

import {
  addEventAttendee,
  cancelEventAttendance,
  createCalendar,
  createCalendarEvent,
  deleteCalendarEvent,
  removeEventAttendee,
  updateCalendarEvent,
} from '../src/services/Google';

const { objectContaining, arrayContaining } = expect;

const attendees: calendar_v3.Schema$EventAttendee[] = [
  { email: 'a@person', responseStatus: 'accepted' },
  { email: 'b@person', responseStatus: 'accepted' },
  { email: 'c@person', responseStatus: 'accepted' },
];

const mockGet = () => {
  return {
    data: {
      attendees: attendees,
    },
  };
};

// This just returns whatever was passed in. In reality, each attendee would
// get a responseStatus, but we're only checking that the update is called
// with the correct attendees.
const mockUpdate = jest.fn(
  ({ requestBody }: calendar_v3.Params$Resource$Events$Update) => ({
    data: requestBody,
  }),
);

const mockInsertEvent = jest.fn(
  ({ requestBody }: calendar_v3.Params$Resource$Events$Insert) => ({
    data: requestBody,
  }),
);

const mockDelete = jest.fn();

const mockEvents = {
  get: mockGet,
  update: mockUpdate,
  insert: mockInsertEvent,
  delete: mockDelete,
};

const mockInsertCalendar = jest.fn(
  ({ requestBody }: calendar_v3.Params$Resource$Calendars$Insert) => ({
    data: requestBody,
  }),
);

const mockCalendars = {
  insert: mockInsertCalendar,
};

jest.mock('../src/services/InitGoogle', () => {
  const originalModule = jest.requireActual('../src/services/InitGoogle');

  return {
    __esModule: true,
    ...originalModule,
    createCalendarApi: jest.fn(() => ({
      events: mockEvents,
      calendars: mockCalendars,
    })),
  };
});

const eventParams = objectContaining({
  sendUpdates: 'all',
  requestBody: objectContaining({
    guestsCanInviteOthers: false,
    guestsCanSeeOtherGuests: false,
  }),
});

describe('Google Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('removeEventAttendee', () => {
    it('should update everyone and configure guest permissions', async () => {
      await removeEventAttendee(
        { calendarId: 'foo', calendarEventId: 'bar' },
        { attendeeEmail: 'b@person' },
      );

      expect(mockUpdate).toHaveBeenCalledWith(eventParams);
      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });

    const remainingAttendees = [
      { email: 'a@person', responseStatus: 'accepted' },
      { email: 'c@person', responseStatus: 'accepted' },
    ];

    it('should remove the attendee from the event', async () => {
      const updatedEvent = await removeEventAttendee(
        { calendarId: 'id', calendarEventId: 'id' },
        { attendeeEmail: 'b@person' },
      );

      expect(updatedEvent.data.attendees?.length).toBe(2);
      expect(updatedEvent.data.attendees).toEqual(
        arrayContaining(remainingAttendees),
      );
    });

    it("should do nothing if the email is not one of the attendee's", async () => {
      const updatedEvent = await removeEventAttendee(
        { calendarId: 'id', calendarEventId: 'id' },
        { attendeeEmail: 'd@person' },
      );

      expect(updatedEvent.data.attendees?.length).toBe(3);
      expect(updatedEvent.data.attendees).toEqual(arrayContaining(attendees));
    });
  });

  describe('addEventAttendee', () => {
    it('should update everyone and configure guest permissions', async () => {
      await addEventAttendee(
        { calendarId: 'foo', calendarEventId: 'bar' },
        { attendeeEmail: 'b@person' },
      );

      expect(mockUpdate).toHaveBeenCalledWith(eventParams);
      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });

    it('should add the attendee to the event', async () => {
      const updatedEvent = await addEventAttendee(
        { calendarId: 'id', calendarEventId: 'id' },
        { attendeeEmail: 'd@person' },
      );

      expect(updatedEvent.data.attendees?.length).toBe(4);
      expect(updatedEvent.data.attendees).toEqual(
        arrayContaining([...attendees, { email: 'd@person' }]),
      );
    });
  });

  describe('cancelEventAttendance', () => {
    it('should update everyone and configure guest permissions', async () => {
      await cancelEventAttendance(
        { calendarId: 'foo', calendarEventId: 'bar' },
        { attendeeEmail: 'b@person' },
      );

      expect(mockUpdate).toHaveBeenCalledWith(eventParams);
      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });

    it('should cancel (but not remove) attendance', async () => {
      const updatedEvent = await cancelEventAttendance(
        { calendarId: 'id', calendarEventId: 'id' },
        { attendeeEmail: 'b@person' },
      );

      const expectedAttendees = [
        ...attendees.filter((attendee) => attendee.email !== 'b@person'),
        { email: 'b@person', responseStatus: 'declined' },
      ];

      expect(updatedEvent.data.attendees?.length).toBe(3);
      expect(updatedEvent.data.attendees).toEqual(
        arrayContaining(expectedAttendees),
      );
    });
  });

  describe('createCalendarEvent', () => {
    it('should update everyone and configure guest permissions', async () => {
      await createCalendarEvent({ calendarId: 'foo' }, {});

      expect(mockInsertEvent).toHaveBeenCalledWith(eventParams);
      expect(mockInsertEvent).toHaveBeenCalledTimes(1);
    });

    it('include event details in the request to Google', async () => {
      const start = '2022-12-05T14:07:12.687Z';
      const end = '2022-12-05T14:10:56.874Z';
      const eventData = {
        start: new Date(start),
        end: new Date(end),
        summary: 'test',
        attendees: [{ email: 'a@person' }, { email: 'b@person' }],
      };
      const expectedRequestBody = {
        start: { dateTime: start },
        end: { dateTime: end },
        summary: 'test',
        attendees: [{ email: 'a@person' }, { email: 'b@person' }],
      };
      await createCalendarEvent({ calendarId: 'foo' }, eventData);

      expect(mockInsertEvent).toHaveBeenCalledWith(
        objectContaining({
          requestBody: objectContaining(expectedRequestBody),
        }),
      );
      expect(mockInsertEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateCalendarEvent', () => {
    it('should update everyone and configure guest permissions', async () => {
      await updateCalendarEvent(
        { calendarId: 'foo', calendarEventId: 'bar' },
        {},
      );

      expect(mockUpdate).toHaveBeenCalledWith(eventParams);
      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });

    it('ignores attendees in the request to Google', async () => {
      const start = '2022-12-05T14:07:12.687Z';
      const end = '2022-12-05T14:10:56.874Z';
      const eventData = {
        start: new Date(start),
        end: new Date(end),
        summary: 'test',
        attendees: [{ email: 'a@person' }, { email: 'b@person' }],
      };
      const expectedRequestBody = {
        start: { dateTime: start },
        end: { dateTime: end },
        summary: 'test',
        attendees,
      };

      await updateCalendarEvent(
        { calendarId: 'foo', calendarEventId: 'bar' },
        eventData,
      );

      expect(mockUpdate).toHaveBeenCalledWith(
        objectContaining({
          requestBody: objectContaining(expectedRequestBody),
        }),
      );
      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });
  });

  describe('createCalendar', () => {
    it('should insert a new calendar with a summary and description', async () => {
      await createCalendar({
        summary: 'foo',
        description: 'bar',
      });

      expect(mockInsertCalendar).toHaveBeenCalledWith(
        objectContaining({
          requestBody: { summary: 'foo', description: 'bar' },
        }),
      );
    });
  });

  describe('deleteCalendarEvent', () => {
    it('should call the delete endpoint', async () => {
      await deleteCalendarEvent({
        calendarId: 'foo',
        calendarEventId: 'bar',
      });

      expect(mockDelete).toHaveBeenCalledWith(
        objectContaining({
          calendarId: 'foo',
          eventId: 'bar',
          sendUpdates: 'all',
        }),
      );
    });
  });
});
