import { gql } from '@apollo/client';

export const EVENTS = gql`
  query events {
    events(showAll: true) {
      id
      name
      canceled
      description
      url
      invite_only
      streaming_url
      start_at
      capacity
      venue_type
      venue {
        id
        name
      }
      tags {
        tag {
          id
          name
        }
      }
    }
  }
`;

export const EVENT = gql`
  query event($id: Int!) {
    event(id: $id) {
      id
      name
      description
      url
      invite_only
      streaming_url
      canceled
      capacity
      start_at
      ends_at
      image_url
      chapter {
        id
        name
      }
      tags {
        tag {
          id
          name
        }
      }
      sponsors {
        sponsor {
          name
          website
          logo_path
          type
          id
        }
      }
      venue_type
      venue {
        id
        name
        street_address
        city
        postal_code
        region
        country
      }
      rsvps {
        on_waitlist
        user {
          id
          name
        }
      }
    }
  }
`;

export const EVENT_WITH_VENU = gql`
  query eventVenues($id: Int!) {
    event(id: $id) {
      id
      name
      description
      url
      streaming_url
      capacity
      start_at
      ends_at
      tags {
        tag {
          id
          name
        }
      }
      venue {
        id
      }
    }
    venues {
      id
      name
    }
  }
`;

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
      confirmed_at
      on_waitlist
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

export const Sponsors = gql`
  query sponsors {
    sponsors {
      id
      name
      website
      logo_path
      type
    }
  }
`;
