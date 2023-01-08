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
      chat_url
    }
  }
`;

export const createChapterCalendar = gql`
  mutation createChapterCalendar($chapterId: Int!) {
    createChapterCalendar(id: $chapterId) {
      id
      calendar_id
    }
  }
`;

export const updateChapter = gql`
  mutation updateChapter($chapterId: Int!, $data: UpdateChapterInputs!) {
    updateChapter(id: $chapterId, data: $data) {
      id
      name
      description
      city
      region
      country
      chat_url
    }
  }
`;

export const deleteChapter = gql`
  mutation deleteChapter($chapterId: Int!) {
    deleteChapter(id: $chapterId) {
      id
    }
  }
`;

export const banUser = gql`
  mutation banUser($chapterId: Int!, $userId: Int!) {
    banUser(chapterId: $chapterId, userId: $userId) {
      user_id
    }
  }
`;

export const unbanUser = gql`
  mutation unbanUser($chapterId: Int!, $userId: Int!) {
    unbanUser(chapterId: $chapterId, userId: $userId) {
      user_id
    }
  }
`;

export const changeChapterUserRole = gql`
  mutation changeChapterUserRole(
    $chapterId: Int!
    $roleName: String!
    $userId: Int!
  ) {
    changeChapterUserRole(
      chapterId: $chapterId
      roleName: $roleName
      userId: $userId
    ) {
      chapter_role {
        name
      }
    }
  }
`;
