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
        image_url
        invite_only
        canceled
        event_tags {
          tag {
            id
            name
          }
        }
      }
      chapter_tags {
        tag {
          id
          name
        }
      }
    }
  }
`;

export const CHAPTERS = gql`
  query chapters {
    chapters {
      id
      name
      description
      logo_url
      banner_url
      events {
        id
        canceled
        start_at
        ends_at
        name
        invite_only
      }
      chapter_tags {
        tag {
          id
          name
        }
      }
      _count {
        chapter_users
      }
    }
  }
`;
