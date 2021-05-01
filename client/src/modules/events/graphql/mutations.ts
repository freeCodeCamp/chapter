import { gql } from '@apollo/client';

export const rsvpToEvent = gql`
  mutation rsvpToEvent($eventId: Int!) {
    rsvpEvent(id: $eventId) {
      id
    }
  }
`;
