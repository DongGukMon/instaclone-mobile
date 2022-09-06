import {gql, useMutation} from '@apollo/client';
import React from 'react';
import {View} from 'react-native';
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

function Comment({
  username,
  payload,
  isCaption,
  isMine,
  id,
  photoId,
}: CommentProps) {
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
    <View
      style={{
        marginBottom: isCaption ? 3 : 8,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <FatText style={{color: 'white'}}>{username}</FatText>
        <PayloadText style={{marginLeft: 5, color: 'white'}}>
          {payload}
        </PayloadText>
      </View>
      {isMine && !isCaption ? (
        <TouchableOpacity
          onPress={() => deleteCommentMutation({variables: {id}})}>
          <Icon name="close" size={20} color="red" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default React.memo(Comment);
