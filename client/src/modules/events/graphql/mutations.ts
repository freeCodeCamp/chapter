import { gql } from '@apollo/client';

// TODO: mutations must return something, so it returns confirmed_at for now.
// Should it return something the client can use?
export const attendEvent = gql`
  mutation attendEvent($eventId: Int!, $chapterId: Int!) {
    attendEvent(eventId: $eventId, chapterId: $chapterId) {
      updated_at
      attendance {
        name
      }
    }
  }
`;

export const cancelAttendance = gql`
  mutation cancelAttendance($eventId: Int!) {
    cancelAttendance(eventId: $eventId) {
      updated_at
    }
  }
`;

export const subscribeToEvent = gql`
  mutation subscribeToEvent($eventId: Int!) {
    subscribeToEvent(eventId: $eventId) {
      subscribed
    }
  }
`;

export const unsubscribeFromEvent = gql`
  mutation unsubscribeFromEvent($eventId: Int!) {
    unsubscribeFromEvent(eventId: $eventId) {
      subscribed
    }
  }
`;
