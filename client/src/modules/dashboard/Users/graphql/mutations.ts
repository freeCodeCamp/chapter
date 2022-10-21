import { gql } from '@apollo/client';

export const changeInstanceUserRole = gql`
  mutation changeInstanceUserRole($roleName: String!, $userId: Int!) {
    changeInstanceUserRole(roleName: $roleName, userId: $userId) {
      instance_role {
        name
      }
    }
  }
`;
