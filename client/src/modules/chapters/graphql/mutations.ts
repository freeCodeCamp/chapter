import { gql } from '@apollo/client';

export const joinChapter = gql`
  mutation joinChapter($chapterId: Int!) {
    joinChapter(chapterId: $chapterId) {
      user {
        name
      }
      chapter_role {
        name
      }
      subscribed
    }
  }
`;

export const chapterSubscribe = gql`
  mutation chapterSubscribe($chapterId: Int!) {
    chapterSubscribe(chapterId: $chapterId) {
      subscribed
    }
  }
`;
