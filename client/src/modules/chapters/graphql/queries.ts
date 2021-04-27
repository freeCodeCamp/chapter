import { gql } from '@apollo/client';

export const CHAPTER = gql`
  query chapter($id: Int!) {
    chapter(id: $id) {
      id
      name
      description
      events {
        id
        name
        description
        start_at
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
