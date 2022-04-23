import { gql } from '@apollo/client';

export const CHAPTER = gql`
  query chapter($id: Int!) {
    chapter(id: $id) {
      id
      name
      description
      category
      city
      region
      country
      imageUrl
      chatUrl
      events {
        id
        name
        description
        start_at
        invite_only
        canceled
        image_url
        tags {
          tag {
            id
            name
          }
        }
        invite_only
        canceled
      }
    }
  }
`;

export const CHAPTER_USERS = gql`
  query chapterUsers($id: Int!) {
    chapter(id: $id) {
      chapter_users {
        user {
          name
          email
        }
        chapter_role {
          name
        }
        subscribed
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
      category
      imageUrl
    }
  }
`;
