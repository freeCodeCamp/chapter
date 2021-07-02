import { gql } from '@apollo/client';

export const CHAPTER = gql`
  query chapter($id: Int!) {
    chapter(id: $id) {
      id
      name
      description
      details
      category
      city
      region
      country
      events {
        id
        name
        description
        start_at
        tags {
          id
          name
        }
        invite_only
        canceled
      }
    }
  }
`;

export const CHAPTERS = gql`
  query chapters {
    chapters {
      id
      name
      description
    }
  }
`;
