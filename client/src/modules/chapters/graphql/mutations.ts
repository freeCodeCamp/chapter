import { gql } from '@apollo/client';

export const joinChapter = gql`
  mutation joinChapter($chapterId: Int!) {
    joinChapter(chapterId: $chapterId) {
      chapter_role {
        name
      }
    }
  }
`;

export const ToggleChapterMembership = gql`
  mutation ToggleChapterMembership($chapterId: Int!) {
    ToggleChapterMembership(chapterId: $chapterId) {
      chapter_role {
        name
      }
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
