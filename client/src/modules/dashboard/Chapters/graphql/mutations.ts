import { gql } from '@apollo/client';

export const createChapter = gql`
  mutation createChapter($data: CreateChapterInputs!) {
    createChapter(data: $data) {
      id
      name
      description
      city
      region
      country
      chatUrl
    }
  }
`;

export const updateChapter = gql`
  mutation updateChapter($id: Int!, $data: UpdateChapterInputs!) {
    updateChapter(id: $id, data: $data) {
      id
      name
      description
      city
      region
      country
      chatUrl
    }
  }
`;

export const banUser = gql`
  mutation banUser($chapterId: Int!, $userId: Int!) {
    banUser(chapterId: $chapterId, userId: $userId) {
      user {
        name
      }
    }
  }
`;
