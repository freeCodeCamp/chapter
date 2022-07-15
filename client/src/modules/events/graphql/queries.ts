import { gql } from '@apollo/client';

export const DATA_EVENTS_QUERY = gql`
  query PaginatedEvents($limit: Int, $offset: Int) {
    paginatedEvents(limit: $limit, offset: $offset) {
      id
      name
      description
      start_at
      invite_only
      canceled
      image_url
      tags {
        tag {
          id
          name
        }
      }
      chapter {
        id
        name
        category
      }
    }
  }
`;

export const MINIMAL_DATA_EVENTS_QUERY = gql`
  query minEvents {
    events {
      id
      name
      description
      start_at
      invite_only
      canceled
      image_url
      tags {
        tag {
          id
          name
        }
      }
      chapter {
        id
        name
        category
      }
    }
  }
`;
