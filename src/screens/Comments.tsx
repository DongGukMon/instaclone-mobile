import {gql, useQuery} from '@apollo/client';
import {useRoute} from '@react-navigation/native';
import React from 'react';
import {FlatList, KeyboardAvoidingView, Platform} from 'react-native';
import styled from 'styled-components/native';
import CommentInput from '../components/feed/commentInput';
import ScreenLayout from '../components/ScreenLayout';
import Comment from '../components/feed/Comment';
import {client} from '../apollo';
import {colors} from '../colors';

export const SEE_PHOTO_QUERY = gql`
  query seePhoto($id: Int!) {
    seePhoto(id: $id) {
      commentNumber
      comments {
        payload
        isMine
        id
        user {
          avatar
          username
        }
      }
      caption
      user {
        username
        avatar
      }
    }
  }
`;

const CommentsContainer = styled.View`
  flex: 1;
  margin-top: 10px;
`;

const PhotoCaption = styled.View``;

const Separator = styled.View`
  border-width: 0.5px;
  border-color: ${colors.placeholder};
  width: 100%;
  align-self: center;
  margin: 10px 0px;
`;

export default function Comments() {
  const {params}: any = useRoute();

  const {data, loading} = useQuery(SEE_PHOTO_QUERY, {
    variables: {id: params?.photoId},
    onCompleted: () => {
      //seePhoto query로 data를 불러오면 root query cache에 별도의 데이터로 저장된다.
      //댓글을 달거나 삭제하면 root query cache가 아니라 각 photo의 캐시를 수정하게 되는데, 해당 페이지의 데이터는 root query 하위에 있는
      //seePhoto data에 의존하게 된다. 따라서 root query 하위에 있는 seePhoto cache를 기존에 가지고 있던 photo를 참조하도록 변경해주는 작업이 필요하다.
      client.cache.modify({
        fields: {
          [`seePhoto({"id":${params?.photoId}})`]: () => {
            return {__ref: `Photo:${params?.photoId}`};
          },
        },
      });
    },
  });

  const _renderItem = ({item}: any) => {
    const {
      payload,
      isMine,
      id,
      user: {avatar, username},
    } = item;
    const commentProps = {
      payload,
      isMine,
      username,
      id,
      avatar: avatar,
      photoId: params?.photoId,
    };

    return <Comment {...commentProps} />;
  };

  return (
    <ScreenLayout>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={70}>
        <CommentsContainer>
          <PhotoCaption>
            <Comment
              isCaption={true}
              payload={data?.seePhoto?.caption}
              username={data?.seePhoto?.user?.username}
              avatar={data?.seePhoto?.user?.avatar}
            />
          </PhotoCaption>
          <Separator />
          <FlatList
            data={data?.seePhoto?.comments?.slice().reverse()}
            keyExtractor={item => item.id + ''}
            renderItem={_renderItem}
            inverted={true}
          />
        </CommentsContainer>
        <CommentInput inputName="comment" photoId={params?.photoId} />
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}
