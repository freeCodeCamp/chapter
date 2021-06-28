import { gql } from '@apollo/client';

export const EVENTS = gql`
  query events {
    events(showAll: true) {
      id
      name
      canceled
      description
      url
      video_url
      start_at
      capacity
      venue {
        id
        name
      }
      tags {
        id
        name
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
      video_url
      canceled
      capacity
      start_at
      ends_at
      chapter {
        id
        name
      }
      tags {
        id
        name
      }
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
        id
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
      video_url
      capacity
      start_at
      ends_at
      tags {
        id
        name
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
      video_url
      capacity
      tags {
        id
        name
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
      video_url
      capacity
      tags {
        id
        name
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
    deleteEvent(id: $id)
  }
`;
