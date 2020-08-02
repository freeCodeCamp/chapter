import { gql } from '@apollo/client';

export const CHAPTERS_QUERY = gql`
  query chapters {
    chapters {
      id
      name
      description
    }
  }
`;
