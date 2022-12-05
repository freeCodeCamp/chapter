import type { calendar_v3 } from '@googleapis/calendar';

import {
  addEventAttendee,
  cancelEventAttendance,
  removeEventAttendee,
} from '../src/services/Google';

const mockAttendees: calendar_v3.Schema$EventAttendee[] = [
  { email: 'a@person', responseStatus: 'accepted' },
  { email: 'b@person', responseStatus: 'accepted' },
  { email: 'c@person', responseStatus: 'accepted' },
];

const mockUpdate = jest.fn(
  ({ requestBody }: calendar_v3.Params$Resource$Events$Update) => ({
    data: requestBody,
  }),
);

const mockEvents = {
  get(): { data: calendar_v3.Schema$Event } {
    return {
      data: {
        attendees: mockAttendees,
      },
    };
  },
  // This just returns whatever was passed in. In reality, each attendee would
  // get a responseStatus, but we're only checking that the update is called
  // with the correct attendees.
  update: mockUpdate,
};

jest.mock('../src/services/InitGoogle', () => {
  const originalModule = jest.requireActual('../src/services/InitGoogle');

  return {
    __esModule: true,
    ...originalModule,
    createCalendarApi: jest.fn(() => ({
      events: mockEvents,
    })),
  };
});

const updateParams = expect.objectContaining({
  sendUpdates: 'all',
  requestBody: expect.objectContaining({
    guestsCanInviteOthers: false,
    guestsCanSeeOtherGuests: false,
  }),
});

describe('removeEventAttendee', () => {
  it('should update everyone and configure guest permissions', async () => {
    await removeEventAttendee(
      { calendarId: 'foo', calendarEventId: 'bar' },
      { attendeeEmail: 'b@person' },
    );

    expect(mockUpdate).toHaveBeenCalledWith(updateParams);
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
      expect.arrayContaining(remainingAttendees),
    );
  });

  it("should do nothing if the email one of the attendee's", async () => {
    const updatedEvent = await removeEventAttendee(
      { calendarId: 'id', calendarEventId: 'id' },
      { attendeeEmail: 'd@person' },
    );

    expect(updatedEvent.data.attendees?.length).toBe(3);
    expect(updatedEvent.data.attendees).toEqual(
      expect.arrayContaining(mockAttendees),
    );
  });
});

describe('addEventAttendee', () => {
  it('should update everyone and configure guest permissions', async () => {
    await addEventAttendee(
      { calendarId: 'foo', calendarEventId: 'bar' },
      { attendeeEmail: 'b@person' },
    );

    expect(mockUpdate).toHaveBeenCalledWith(updateParams);
  });

  it('should add the attendee to the event', async () => {
    const updatedEvent = await addEventAttendee(
      { calendarId: 'id', calendarEventId: 'id' },
      { attendeeEmail: 'd@person' },
    );

    expect(updatedEvent.data.attendees?.length).toBe(4);
    expect(updatedEvent.data.attendees).toEqual(
      expect.arrayContaining([...mockAttendees, { email: 'd@person' }]),
    );
  });
});

describe('cancelEventAttendance', () => {
  it('should update everyone and configure guest permissions', async () => {
    await cancelEventAttendance(
      { calendarId: 'foo', calendarEventId: 'bar' },
      { attendeeEmail: 'b@person' },
    );

    expect(mockUpdate).toHaveBeenCalledWith(updateParams);
  });

  it('should cancel (but not remove) attendance', async () => {
    const updatedEvent = await cancelEventAttendance(
      { calendarId: 'id', calendarEventId: 'id' },
      { attendeeEmail: 'b@person' },
    );

    const expectedAttendees = [
      ...mockAttendees.filter((attendee) => attendee.email !== 'b@person'),
      { email: 'b@person', responseStatus: 'declined' },
    ];

    expect(updatedEvent.data.attendees?.length).toBe(3);
    expect(updatedEvent.data.attendees).toEqual(
      expect.arrayContaining(expectedAttendees),
    );
  });
});