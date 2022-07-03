import { gql } from '@apollo/client';

export const changeInstanceUserRole = gql`
  mutation changeInstanceUserRole($roleId: Int!, $userId: Int!) {
    changeInstanceUserRole(roleId: $roleId, userId: $userId) {
      instance_role {
        id
      }
    }
  }
`;
