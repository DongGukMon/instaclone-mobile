import React from 'react';
import styled from 'styled-components/native';
import ActionButtons from './ActionButtons';
import CommentsComponent from './CommentsComponent';
import UsernameRow from './UsernameRow';
import PhotoImage from './PhotoImage';

interface PhotoProps {
  id: number;
  file: string;
  caption: string;
  likes: number;
  commentNumber: number;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  comments: [
    {
      id: number;
      payload: string;
      user: {
        username: string;
        avatar?: string;
      };
      isMine: boolean;
      createdAt: string;
    },
  ];
  isMine: boolean;
  isLiked: boolean;
  children: React.ReactNode;
}

const PostContainer = styled.View`
  width: 100%;
  margin-top: 20px;
`;

function Photo({
  user,
  comments,
  file,
  caption,
  likes,
  commentNumber,
  isMine,
  isLiked,
  children,
  id,
}: PhotoProps) {
  return (
    <PostContainer>
      <UsernameRow username={user?.username} avatar={user?.avatar} />
      <PhotoImage file={file} />
      <ActionButtons isLiked={isLiked} likes={likes} id={id} />
      <CommentsComponent
        caption={caption}
        commentNumber={commentNumber}
        author={user?.username}
        comments={comments}
        photoId={id}
      />
    </PostContainer>
  );
}

export default React.memo(Photo);
