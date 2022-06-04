import { gql } from '@apollo/client';

export const changeEventUserRole = gql`
  mutation changeEventUserRole($eventId: Int!, $roleId: Int!, $userId: Int!) {
    changeEventUserRole(eventId: $eventId, roleId: $roleId, userId: $userId) {
      event_role {
        id
      }
    }
  }
`;
