import { gql } from '@apollo/client';

export const unsubscribeMutation = gql`
  mutation unsubscribe($token: String!) {
    unsubscribe(token: $token)
  }
`;
