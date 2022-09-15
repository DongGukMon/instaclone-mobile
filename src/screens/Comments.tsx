import {gql, useQuery} from '@apollo/client';
import {useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {FlatList, Image, Text, View} from 'react-native';
import styled from 'styled-components/native';
import CommentInput from '../components/feed/commentInput';
import ScreenLayout from '../components/ScreenLayout';
import Comment from '../components/feed/Comment';
import {client} from '../apollo';

// id: Int!
//     user: User!
//     userId: Int!
//     file: String!
//     caption: String
//     hashtags: [Hashtag]!
//     createdAt: String!
//     updatedAt: String!
//     likes: Int!
//     isMine: Boolean!
//     commentNumber: Int!
//     comments: [Comment]
//     isLiked: Boolean!

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
`;

const PhotoCaption = styled.View``;

export default function Comments() {
  const {params}: any = useRoute();

  const {data, loading} = useQuery(SEE_PHOTO_QUERY, {
    variables: {id: params?.photoId},
    onCompleted: () => {
      //seePhoto query로 data를 불러오면 root query cache에 별도의 데이터로 저장된다.
      //댓글을 달거나 삭제하면 root query cache가 아니라 각 photo의 캐시를 수정하게 되는데, 해당 페이지의 데이터는 root query 하위에 있는
      //seePhoto data에 의존하게 된다. 따라서 root query 하단에 있는 seePhoto cache를 기존에 가지고 있던 photo를 참조하도록 변경해주는 작업이 필요하다.
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

  console.log(loading);

  return (
    <ScreenLayout>
      <CommentsContainer>
        <PhotoCaption>
          <Text style={{color: 'white'}}>{data?.seePhoto?.commentNumber}</Text>
        </PhotoCaption>
        <FlatList
          data={data?.seePhoto?.comments}
          keyExtractor={item => item.id + ''}
          renderItem={_renderItem}
        />
      </CommentsContainer>
      <CommentInput inputName="comment" photoId={params?.photoId} />
    </ScreenLayout>
  );
}
