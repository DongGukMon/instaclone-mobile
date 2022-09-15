import {gql, useMutation} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';

interface CommentProps {
  payload: string;
  username: string;
  isCaption?: boolean;
  isMine?: boolean;
  id?: number;
  photoId?: number;
  avatar?: string;
}

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
      error
    }
  }
`;

const FatText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const PayloadText = styled.Text`
  margin-left: 5px;
  color: white;
  font-size: 16px;
  font-weight: 300;
`;

const CommentContainer = styled.View`
  margin-bottom: ${(props: any) => (props.isCaption ? 3 : 8)}px;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`;

const AvatarContainer = styled.View`
  background-color: gray;
  border-radius: 30px;
  overflow: hidden;
  width: 32px;
  height: 32px;
  margin-right: 5px;
`;

function Comment({
  username,
  payload,
  isCaption,
  isMine,
  id,
  photoId,
  avatar,
}: CommentProps) {
  const {navigate} = useNavigation();

  // const goToProfile = navigate('Profile' as never, {username:username} as never);

  const deleteCommentUpdate = (cache: any, result: any) => {
    const {
      data: {
        deleteComment: {ok},
      },
    } = result;

    if (ok) {
      cache.evict({id: `Comment:${id}`});

      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          commentNumber: (prev: number) => prev - 1,
        },
      });
    }
  };

  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
    update: deleteCommentUpdate,
  });

  return (
    <CommentContainer isCaption={isCaption}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 1,
        }}
        onPress={() =>
          navigate('Profile' as never, {username: username} as never)
        }>
        {(avatar || avatar === null) && (
          <AvatarContainer>
            <Image
              style={{width: '100%', height: '100%'}}
              source={{uri: avatar}}
            />
          </AvatarContainer>
        )}
        <FatText style={{color: 'white'}}>{username}</FatText>
        <PayloadText style={{marginLeft: 5, color: 'white'}}>
          {payload}
        </PayloadText>
      </TouchableOpacity>
      {isMine && !isCaption ? (
        <TouchableOpacity
          onPress={() => deleteCommentMutation({variables: {id}})}>
          <Icon name="close" size={20} color="red" />
        </TouchableOpacity>
      ) : null}
    </CommentContainer>
  );
}

export default React.memo(Comment);
