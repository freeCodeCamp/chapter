import { gql } from '@apollo/client';

export const HOME_PAGE_QUERY = gql`
  query home($limit: Int, $offset: Int) {
    paginatedEvents(limit: $limit, offset: $offset) {
      id
      name
      description
      invite_only
      canceled
      start_at
      image_url
      chapter {
        id
        name
        category
      }
    }
    chapters {
      id
      name
      description
      image_url
      logo_url
      city
      events {
        id
        name
        capacity
        venue {
          id
          name
          region
          street_address
        }
      }
    }
  }
`;
