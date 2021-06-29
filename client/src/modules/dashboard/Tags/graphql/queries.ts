import { gql } from '@apollo/client';

export const TAGS = gql`
  query tags {
    tags {
      id
      name
    }
  }
`;
