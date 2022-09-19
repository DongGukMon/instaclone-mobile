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

export const ROOM_FRAGEMNT = gql`
  fragment RoomFragment on Room {
    id
    messages {
      id
      user {
        avatar
        username
      }
      payload
      read
      createdAt
    }
  }
`;

export const MESSAGE_FRAGMENT = gql`
  fragment MessageFragment on Message {
    id
    roomId
    user {
      avatar
      username
    }
    payload
    read
    createdAt
  }
`;
