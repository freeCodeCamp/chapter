import { gql } from '@apollo/client';

export const deleteMe = gql`
  mutation deleteMe($userId: Int!) {
    deleteMe(id: $userId) {
      id
    }
  }
`;
