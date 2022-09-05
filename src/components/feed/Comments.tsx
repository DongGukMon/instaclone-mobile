import {isDefinitionNode} from 'graphql';
import React from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components/native';
import {TextInput} from '../auth/AuthShared';
import Comment from './Comment';

interface CommentsProps {
  comments: [
    {
      id: string;
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

export default function Comments({
  comments,
  caption,
  commentNumber,
  author,
}: CommentsProps) {
  return (
    <CommentsContainer>
      <Comment payload={caption} username={author} isCaption={true} />
      <CommentNumber>
        {commentNumber === 1 ? '1 comment' : `${commentNumber} comments`}
      </CommentNumber>
      {comments?.map(comment => {
        const {
          id,
          payload,
          user: {username},
          isMine,
        } = comment;
        return (
          <Comment
            key={id}
            payload={payload}
            username={username}
            isMine={isMine}
          />
        );
      })}
      <View style={{marginVertical: 10}}>
        <TextInput style={{height: 40}} />
      </View>
    </CommentsContainer>
  );
}
