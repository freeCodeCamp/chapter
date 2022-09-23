import { gql } from '@apollo/client';

export const deleteMe = gql`
  mutation deleteMe {
    deleteMe {
      id
    }
  }
`;
