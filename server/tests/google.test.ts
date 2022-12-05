import type { calendar_v3 } from '@googleapis/calendar';

import { removeEventAttendee } from '../src/services/Google';

const mockEvents = {
  get(): { data: calendar_v3.Schema$Event } {
    return {
      data: {
        attendees: [
          { email: 'a@person' },
          { email: 'b@person' },
          { email: 'c@person' },
        ],
      },
    };
  },
  update({ requestBody }: calendar_v3.Params$Resource$Events$Update): {
    data: calendar_v3.Schema$Event;
  } {
    return {
      data: {
        attendees: requestBody?.attendees,
      },
    };
  },
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

describe('removeEventAttendee', () => {
  it('should remove the attendee from the event', async () => {
    const updatedEvent = await removeEventAttendee(
      { calendarId: 'id', calendarEventId: 'id' },
      { attendeeEmail: 'b@person' },
    );

    expect(updatedEvent.data.attendees?.length).toBe(2);
    expect(updatedEvent.data.attendees).toEqual(
      expect.arrayContaining([{ email: 'a@person' }, { email: 'c@person' }]),
    );
  });
});
