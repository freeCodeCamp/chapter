import { gql } from '@apollo/client';

export const toggleAutoSubscribe = gql`
  mutation toggleAutoSubscribe {
    toggleAutoSubscribe {
      auto_subscribe
    }
  }
`;
