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
      image
      events {
        id
        name
        description
        start_at
        invite_only
        canceled
        tags {
          id
          name
        }
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
