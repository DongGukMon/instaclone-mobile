import {gql, useMutation} from '@apollo/client';
import React, {useCallback} from 'react';
import {useForm} from 'react-hook-form';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import useUser from '../../hooks/me';
import {CommentTextInput, TextInput} from '../auth/AuthShared';
import {SEE_PHOTO_QUERY} from '../../screens/Comments';

interface CommentInputProps {
  inputName: string;
  photoId: number;
}

interface CommentTypes {
  createdAt: string;
  id: number;
  isMine: boolean;
  payload: string;
  user: {
    username: string;
    avatar: string;
  };
}

interface CommentsTypes extends Array<CommentTypes> {}

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($payload: String!, $photoId: Int!) {
    createComment(payload: $payload, photoId: $photoId) {
      ok
      error
      id
    }
  }
`;

const InputContainer = styled.View`
  margin: 10px 0px;
  flex-direction: row;
  background-color: rgba(255, 255, 255, 0.15);
  justify-content: center;
  /* align-items: center; */
  height: 50px;
`;

const CommentInput = ({inputName, photoId}: CommentInputProps) => {
  const {register, setValue, watch, handleSubmit, getValues} = useForm();

  const {user} = useUser();

  const createCommentUpdate = (cache: any, result: any) => {
    const {comment} = getValues();
    setValue('comment', '');
    const id = `Photo:${photoId}`;

    const {
      data: {
        createComment: {ok, id: commentId},
      },
    } = result;
    if (ok) {
      const newComment = {
        __typename: 'Comment',
        createdAt: Date.now().toString(),
        id: commentId,
        isMine: true,
        payload: comment,
        user,
      };

      const newCacheComment = cache.writeFragment({
        fragment: gql`
          fragment BSName on Comment {
            createdAt
            id
            isMine
            payload
            user {
              username
              avatar
            }
          }
        `,
        data: newComment,
      });

      // const photoCache = cache.readQuery({query: SEE_PHOTO_QUERY});
      // console.log(photoCache);
      // cache.writeQuery({
      //   query: SEE_PHOTO_QUERY,
      //   data: {
      //     ...photoCache,
      //     comments(prev: CommentsTypes) {
      //       return [...prev, newCacheComment];
      //     },
      //     commentNumber(prev: number) {
      //       return prev + 1;
      //     },
      //   },
      //   variables: {
      //     id: photoId,
      //   },
      // });

      cache.modify({
        id,

        fields: {
          comments(prev: CommentsTypes) {
            return [...prev, newCacheComment];
          },
          commentNumber(prev: number) {
            return prev + 1;
          },
        },
      });
    }
  };

  const [createComment, {loading}] = useMutation(CREATE_COMMENT_MUTATION, {
    update: createCommentUpdate,
  });

  const onValid = (data: any) => {
    if (loading) {
      return;
    }
    createComment({
      variables: {
        payload: data?.comment,
        photoId,
      },
    });
  };

  return (
    <InputContainer>
      <CommentTextInput
        {...register(inputName, {
          required: true,
        })}
        value={watch(inputName)}
        placeholderTextColor="white"
        placeholder="댓글을 입력해주세요"
        onChangeText={(text: string) => {
          setValue(inputName, text);
        }}
      />
      <TouchableOpacity
        onPress={handleSubmit(onValid)}
        style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Icon name="paper-plane" color="white" size={25} />
      </TouchableOpacity>
    </InputContainer>
  );
};

export default React.memo(CommentInput);
