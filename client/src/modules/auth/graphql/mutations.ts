import { gql } from '@apollo/client';

export const loginMutation = gql`
  mutation login($email: String!) {
    login(data: { email: $email }) {
      code
    }
  }
`;

export const registerMutation = gql`
  mutation register($email: String!, $name: String!) {
    register(data: { email: $email, name: $name }) {
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
        name
        instance_role {
          instance_role_permissions {
            instance_permission {
              name
            }
          }
        }
        admined_chapters {
          id
          name
        }
      }
    }
  }
`;
