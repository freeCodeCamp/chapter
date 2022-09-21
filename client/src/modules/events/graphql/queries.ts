import { gql } from '@apollo/client';
export const DATA_PAGINATED_EVENTS_TOTAL_QUERY = gql`
  query PaginatedEventsWithTotal($limit: Int, $offset: Int) {
    paginatedEventsWithTotal(limit: $limit, offset: $offset) {
      total
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
  }
`;
