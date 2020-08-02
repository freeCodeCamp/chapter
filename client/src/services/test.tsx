import { gql } from '@apollo/client';

export const MainQuery = gql`
  query chapters {
    chapters {
      id
      name
    }
  }
`;
