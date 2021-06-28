import { gql } from '@apollo/client';

export const meQuery = gql`
  query me {
    me {
      id
      first_name
      last_name
    }
  }
`;
