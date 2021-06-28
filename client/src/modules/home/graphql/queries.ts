import { gql } from '@apollo/client';

export const HOME_PAGE_QUERY = gql`
  query home($limit: Int, $offset: Int) {
    paginatedEvents(limit: $limit, offset: $offset) {
      id
      name
      description
      start_at
      tags {
        id
        name
      }
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
      details
    }
  }
`;
