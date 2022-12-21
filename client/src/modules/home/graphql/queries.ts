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
      ends_at
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
      banner_url
      logo_url
      events(limit: $limit) {
        id
        canceled
        start_at
        ends_at
        name
      }
      chapter_users {
        subscribed
      }
    }
  }
`;
