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
      calendar_event_id
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

export const confirmRSVP = gql`
  mutation confirmRsvp($eventId: Int!, $userId: Int!) {
    confirmRsvp(eventId: $eventId, userId: $userId) {
      rsvp {
        updated_at
        name
      }
    }
  }
`;

export const deleteRSVP = gql`
  mutation deleteRsvp($eventId: Int!, $userId: Int!) {
    deleteRsvp(eventId: $eventId, userId: $userId)
  }
`;

export const sendEventInvite = gql`
  mutation sendEventInvite($eventId: Int!) {
    sendEventInvite(id: $eventId)
  }
`;
