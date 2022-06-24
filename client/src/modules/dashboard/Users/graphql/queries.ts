import { gql } from '@apollo/client';

export const InstanceRoles = gql`
  query instanceRoles {
    instanceRoles {
      id
      name
    }
  }
`;

export const Users = gql`
  query users {
    users {
      id
      name
      instance_role {
        id
        name
      }
    }
  }
`;
