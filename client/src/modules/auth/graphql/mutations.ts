import { gql } from '@apollo/client';

export const deleteMe = gql`
  mutation deleteMe {
    deleteMe {
      id
    }
  }
`;

export const updateMe = gql`
  mutation updateMe($data: UpdateUserInputs!) {
    updateMe(data: $data) {
      id
      name
      image_url
    }
  }
`;
