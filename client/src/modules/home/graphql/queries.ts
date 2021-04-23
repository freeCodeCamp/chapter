import { gql } from '@apollo/client';

export const HOME_PAGE_QUERY = gql`
  query homePage {
    events {
      id
      name
      description
      start_at
      tags {
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
