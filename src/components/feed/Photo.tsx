import React from 'react';
import styled from 'styled-components/native';
import ActionButtons from './ActionButtons';
import CommentsComponent from './CommentsComponent';
import UsernameRow from './UsernameRow';
import PhotoImage from './PhotoImage';
import {Alert, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {gql, useMutation} from '@apollo/client';

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

const DELETE_PHOTO_MUTATION = gql`
  mutation deletePhoto($id: Int!) {
    deletePhoto(id: $id) {
      ok
      error
    }
  }
`;

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
  isLiked,
  isMine,
  id,
}: PhotoProps) {
  const deletePhotoUpdate = (cache: any, result: any) => {
    const {ok, error} = result?.data?.deletePhoto;

    if (ok) {
      cache.evict({id: `Photo:${id}`});

      cache.modify({
        id: `User:${user?.id}`,
        fields: {
          totalPhotos: (prev: number) => prev - 1,
        },
      });
    } else {
      console.log(error);
    }
  };
  const [deletePhotoMutation, {loading}] = useMutation(DELETE_PHOTO_MUTATION, {
    update: deletePhotoUpdate,
  });

  const deleteAlert = () => {
    Alert.alert(
      '삭제하시겠습니까?',
      '게시글을 삭제할까요? 삭제하면 복구가 불가능합니다.',
      [
        {
          text: '아니요',
          style: 'cancel',
        },
        {
          text: '네',
          onPress: () => !loading && deletePhotoMutation({variables: {id}}),
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <PostContainer>
      <UsernameRow username={user?.username} avatar={user?.avatar}>
        {isMine ? (
          <TouchableOpacity onPress={deleteAlert}>
            <Icon name="close" size={24} color="red" />
          </TouchableOpacity>
        ) : null}
      </UsernameRow>
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
