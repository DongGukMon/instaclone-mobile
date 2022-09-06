import React, {useCallback, useMemo} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import {TextInput} from '../auth/AuthShared';
import ActionButtons from './ActionButtons';
import Comment from './Comment';
import Comments from './Comments';
import Photoheader from './PhotoHeader';
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
      id: string;
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
  console.log(`${id} Photo render!`);

  return (
    <PostContainer>
      <Photoheader username={user?.username} avatar={user?.avatar} />
      <PhotoImage file={file} />
      <ActionButtons isLiked={isLiked} likes={likes} id={id} />
      <Comments
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
