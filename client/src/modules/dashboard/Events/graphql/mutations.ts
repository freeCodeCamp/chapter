import { gql } from '@apollo/client';

export const createEvent = gql`
  mutation createEvent(
    $chapterId: Int!
    $data: EventInputs!
    $attendEvent: Boolean!
  ) {
    createEvent(chapterId: $chapterId, data: $data, attendEvent: $attendEvent) {
      id
      name
      canceled
      description
      url
      streaming_url
      capacity
      has_calendar_event
    }
  }
`;

export const updateEvent = gql`
  mutation updateEvent($eventId: Int!, $data: EventInputs!) {
    updateEvent(id: $eventId, data: $data) {
      id
      name
      canceled
      description
      url
      streaming_url
      capacity
      invite_only
    }
  }
`;

export const createCalendarEvent = gql`
  mutation createCalendarEvent($eventId: Int!) {
    createCalendarEvent(id: $eventId) {
      id
      has_calendar_event
    }
  }
`;

export const unlinkCalendarEvent = gql`
  mutation unlinkCalendarEvent($eventId: Int!) {
    unlinkCalendarEvent(id: $eventId) {
      id
      has_calendar_event
    }
  }
`;

export const cancelEvent = gql`
  mutation cancelEvent($eventId: Int!) {
    cancelEvent(id: $eventId) {
      id
      canceled
    }
  }
`;

export const deleteEvent = gql`
  mutation deleteEvent($eventId: Int!) {
    deleteEvent(id: $eventId) {
      id
    }
  }
`;

export const confirmAttendee = gql`
  mutation confirmAttendee($eventId: Int!, $userId: Int!) {
    confirmAttendee(eventId: $eventId, userId: $userId) {
      attendance {
        updated_at
        name
      }
    }
  }
`;

export const deleteAttendee = gql`
  mutation deleteAttendee($eventId: Int!, $userId: Int!) {
    deleteAttendee(eventId: $eventId, userId: $userId)
  }
`;

export const moveAttendeeToWaitlist = gql`
  mutation moveAttendeeToWaitlist($eventId: Int!, $userId: Int!) {
    moveAttendeeToWaitlist(eventId: $eventId, userId: $userId) {
      attendance {
        name
      }
    }
  }
`;

export const sendEventInvite = gql`
  mutation sendEventInvite($eventId: Int!) {
    sendEventInvite(id: $eventId)
  }
`;
