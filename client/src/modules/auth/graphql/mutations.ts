import { gql } from '@apollo/client';

export const loginMutation = gql`
  mutation login($email: String!) {
    login(data: { email: $email }) {
      code
    }
  }
`;

export const registerMutation = gql`
  mutation register(
    $email: String!
    $first_name: String!
    $last_name: String!
  ) {
    register(
      data: { email: $email, first_name: $first_name, last_name: $last_name }
    ) {
      id
    }
  }
`;

export const authenticateMutation = gql`
  mutation authenticate($token: String!) {
    authenticate(token: $token) {
      token
      user {
        id
        first_name
        last_name
      }
    }
  }
`;
