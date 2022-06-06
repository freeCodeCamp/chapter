import { gql } from '@apollo/client';

export const createEvent = gql`
  mutation createEvent($data: CreateEventInputs!) {
    createEvent(data: $data) {
      id
      name
      canceled
      description
      url
      streaming_url
      capacity
      tags {
        tag {
          id
          name
        }
      }
    }
  }
`;

export const updateEvent = gql`
  mutation updateEvent($id: Int!, $data: UpdateEventInputs!) {
    updateEvent(id: $id, data: $data) {
      id
      name
      canceled
      description
      url
      streaming_url
      capacity
      tags {
        tag {
          id
          name
        }
      }
    }
  }
`;

export const cancelEvent = gql`
  mutation cancelEvent($id: Int!) {
    cancelEvent(id: $id) {
      id
      canceled
    }
  }
`;

export const deleteEvent = gql`
  mutation deleteEvent($id: Int!) {
    deleteEvent(id: $id) {
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
  mutation sendEventInvite($id: Int!, $emailGroups: [String!]) {
    sendEventInvite(id: $id, emailGroups: $emailGroups)
  }
`;

export const initUserInterestForChapter = gql`
  mutation initUserInterestForChapter($event_id: Int!) {
    initUserInterestForChapter(event_id: $event_id)
  }
`;
