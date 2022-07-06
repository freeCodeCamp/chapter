import { gql } from '@apollo/client';

export const createEvent = gql`
  mutation createEvent($chapterId: Int!, $data: CreateEventInputs!) {
    createEvent(chapterId: $chapterId, data: $data) {
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
  mutation updateEvent($eventId: Int!, $data: UpdateEventInputs!) {
    updateEvent(id: $eventId, data: $data) {
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
  mutation sendEventInvite($eventId: Int!, $emailGroups: [String!]) {
    sendEventInvite(id: $eventId, emailGroups: $emailGroups)
  }
`;

export const initUserInterestForChapter = gql`
  mutation initUserInterestForChapter($eventId: Int!) {
    initUserInterestForChapter(id: $eventId)
  }
`;
