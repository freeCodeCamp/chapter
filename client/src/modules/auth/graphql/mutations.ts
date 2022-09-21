import { gql } from '@apollo/client';

export const deleteMe = gql`
  mutation deleteMe($meId: Int!) {
    deleteMe(id: $meId) {
      id
    }
  }
`;
