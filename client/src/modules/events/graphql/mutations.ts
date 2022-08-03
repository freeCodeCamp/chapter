import { gql } from '@apollo/client';

// TODO: mutations must return something, so it returns confirmed_at for now.
// Should it return something the client can use?
export const rsvpToEvent = gql`
  mutation rsvpToEvent($eventId: Int!, $chapterId: Int!) {
    rsvpEvent(eventId: $eventId, chapterId: $chapterId) {
      updated_at
    }
  }
`;

export const cancelRsvp = gql`
  mutation cancelRsvp($eventId: Int!) {
    cancelRsvp(eventId: $eventId) {
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
