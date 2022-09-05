import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import ActionButtons from './ActionButtons';
import Comments from './Comments';
import Photoheader from './PhotoHeader';

interface PhotoProps {
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
}

const PostContainer = styled.View`
  width: 100%;
  margin-top: 20px;
`;
const PhotoContainer = styled.View`
  width: 100%;
  height: 400;
`;

const PostImage = styled.Image`
  width: 100%;
  height: 400px;
  align-self: center;
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
}: PhotoProps) {
  return (
    <PostContainer>
      <Photoheader username={user?.username} avatar={user?.avatar} />
      <PhotoContainer>
        <PostImage resizeMode="cover" source={{uri: file}} />
      </PhotoContainer>
      <ActionButtons isLiked={isLiked} likes={likes} />
      <Comments
        comments={comments}
        caption={caption}
        commentNumber={commentNumber}
        author={user?.username}
      />
    </PostContainer>
  );
}

export default React.memo(Photo);
