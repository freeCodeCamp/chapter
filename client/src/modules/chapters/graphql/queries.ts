import { gql } from '@apollo/client';

export const CHAPTER = gql`
  query chapter($chapterId: Int!) {
    chapter(id: $chapterId) {
      id
      name
      description
      category
      city
      region
      country
      logo_url
      banner_url
      chat_url
      events {
        id
        name
        description
        start_at
        ends_at
        invite_only
        canceled
        image_url
        invite_only
        canceled
      }
    }
  }
`;

export const CHAPTER_USER = gql`
  query chapterUser($chapterId: Int!) {
    chapterUser(chapterId: $chapterId) {
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

// https://graphql.org/learn/pagination/#slicing
export const CHAPTERS = gql`
  query chapters {
    chapters {
      id
      name
      description
      logo_url
      banner_url
      events(first: 2) {
        id
        canceled
        start_at
        ends_at
        name
      }
      chapter_users {
        subscribed
      }
    }
  }
`;
