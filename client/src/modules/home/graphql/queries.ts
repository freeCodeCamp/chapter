import { gql } from '@apollo/client';

export const HOME_PAGE_QUERY = gql`
  query homePage {
    events(limit: 5) {
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
  }
`;
