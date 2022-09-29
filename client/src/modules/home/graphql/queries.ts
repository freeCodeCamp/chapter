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
      category
      image_url
      events {
        id
        name
        start_at
      }
    }
  }
`;
