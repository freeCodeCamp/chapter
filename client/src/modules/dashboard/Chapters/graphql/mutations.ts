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

export const changeChapterUserRole = gql`
  mutation changeChapterUserRole(
    $chapterId: Int!
    $roleId: Int!
    $userId: Int!
  ) {
    changeChapterUserRole(
      chapterId: $chapterId
      roleId: $roleId
      userId: $userId
    ) {
      chapter_role {
        id
      }
    }
  }
`;
