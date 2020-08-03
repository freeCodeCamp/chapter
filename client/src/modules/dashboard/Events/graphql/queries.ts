import { gql } from '@apollo/client';

export const EVENTS = gql`
  query events {
    events {
      id
      name
      canceled
      description
      capacity
      tags {
        id
        name
      }
    }
  }
`;

export const EVENT = gql`
  query eventVenues($id: Int!) {
    event(id: $id) {
      id
      name
      description
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
      capacity
      tags {
        id
        name
      }
    }
  }
`;
