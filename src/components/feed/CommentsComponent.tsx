import {useNavigation} from '@react-navigation/native';
import {isDefinitionNode} from 'graphql';
import React, {useCallback} from 'react';
import {useForm} from 'react-hook-form';
import {Text, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components/native';
import {TextInput} from '../auth/AuthShared';
import Comment from './Comment';
import CommentInput from './commentInput';

interface CommentsComponentProps {
  photoId: number;
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
  caption: string;
  commentNumber: number;
  author: string;
}

const CommentNumber = styled.Text`
  color: white;
  opacity: 0.8;
  margin-bottom: 10px;
  margin-top: 3px;
  font-size: 12px;
`;

const CommentsContainer = styled.View`
  padding: 0px 10px;
`;

function CommentsComponent({
  caption,
  commentNumber,
  author,
  comments,
  photoId,
}: CommentsComponentProps) {
  const {navigate} = useNavigation();

  const commentRender = useCallback(() => {
    return comments?.map((comment, idx) => {
      if (idx > 2) {
        return null;
      }
      const {
        id,
        payload,
        user: {username},
        isMine,
      } = comment;
      return (
        <Comment
          id={id}
          photoId={photoId}
          key={id}
          payload={payload}
          username={username}
          isMine={isMine}
        />
      );
    });
  }, [comments]);

  const goToComments = () => navigate('Comments' as never, {photoId} as never);

  return (
    <CommentsContainer>
      <Comment payload={caption} username={author} isCaption={true} />
      <TouchableOpacity onPress={goToComments}>
        <CommentNumber>
          {commentNumber === 1 ? '1 comment' : `${commentNumber} comments`}
        </CommentNumber>
      </TouchableOpacity>
      {commentRender()}
    </CommentsContainer>
  );
}
export default React.memo(CommentsComponent);
