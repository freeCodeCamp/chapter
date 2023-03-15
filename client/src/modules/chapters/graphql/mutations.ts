import { gql } from '@apollo/client';

export const joinChapter = gql`
  mutation joinChapter($chapterId: Int!, $subscribe: Boolean) {
    joinChapter(chapterId: $chapterId, subscribe: $subscribe) {
      chapter_role {
        name
      }
    }
  }
`;

export const leaveChapter = gql`
  mutation leaveChapter($chapterId: Int!) {
    leaveChapter(chapterId: $chapterId) {
      user_id
    }
  }
`;

export const chapterSubscribe = gql`
  mutation toggleChapterSubscription($chapterId: Int!) {
    toggleChapterSubscription(chapterId: $chapterId) {
      subscribed
    }
  }
`;
