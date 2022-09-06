import {isDefinitionNode} from 'graphql';
import React, {useCallback} from 'react';
import {useForm} from 'react-hook-form';
import {Text, View} from 'react-native';
import styled from 'styled-components/native';
import {TextInput} from '../auth/AuthShared';
import Comment from './Comment';
import CommentInput from './commentInput';

interface CommentsProps {
  photoId: number;
  comments: [
    {
      id: number;
      payload: string;
      user: {
        username: string;
      };
      isMine: boolean;
    },
  ];

  caption: string;
  commentNumber: number;
  author: string;
}

const CommentNumber = styled.Text`
  color: white;
  opacity: 0.5;
  margin-bottom: 10px;
  font-size: 12px;
`;

const CommentsContainer = styled.View`
  padding: 0px 10px;
`;

function Comments({
  caption,
  commentNumber,
  author,
  comments,
  photoId,
}: CommentsProps) {
  console.log(`${caption} comments render!`);

  const commentRender = useCallback(() => {
    return comments?.map(comment => {
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

  return (
    <CommentsContainer>
      <Comment payload={caption} username={author} isCaption={true} />
      <CommentNumber>
        {commentNumber === 1 ? '1 comment' : `${commentNumber} comments`}
      </CommentNumber>
      {commentRender()}
      <CommentInput inputName="comment" photoId={photoId} />
    </CommentsContainer>
  );
}
export default React.memo(Comments);
