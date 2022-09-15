import {gql, useQuery} from '@apollo/client';
import {useRoute} from '@react-navigation/native';
import React from 'react';
import {ScrollView} from 'react-native';
import Photo from '../components/feed/Photo';
import ScreenLayout from '../components/ScreenLayout';

const SEE_PHOTO_QUERY = gql`
  query seePhoto($id: Int!) {
    seePhoto(id: $id) {
      id
      user {
        id
        username
        avatar
      }
      file
      caption
      likes
      commentNumber
      comments {
        id
        payload
        user {
          username
          avatar
        }
        isMine
        createdAt
      }
      createdAt
      isMine
      isLiked
    }
  }
`;

export default function Detail() {
  const {params}: any = useRoute();

  const {data, loading} = useQuery(SEE_PHOTO_QUERY, {
    variables: {id: params?.photoId},
  });
  const detailInfo = data?.seePhoto;
  console.log('detail render');
  return (
    <ScreenLayout loading={loading}>
      <ScrollView>
        <Photo {...detailInfo} />
      </ScrollView>
    </ScreenLayout>
  );
}
