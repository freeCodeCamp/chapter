import { gql } from '@apollo/client';

export const EVENTS = gql`
  query events {
    events {
      id
      name
      canceled
      description
      url
      capacity
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
      canceled
      capacity
      start_at
      ends_at
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
          first_name
          last_name
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
