import {gql} from '@apollo/client';

export const PHOTO_FRAGMENT = gql`
  fragment PhotoFragment on Photo {
    id
    user {
      id
      username
      avatar
    }
    file
    caption
    likes
    commentNumber
    comments {
      id
      payload
      user {
        username
        avatar
      }
      isMine
      createdAt
    }
    createdAt
    isMine
    isLiked
  }
`;
