import {FlatList, RefreshControl} from 'react-native';
import React, {useState} from 'react';
import {gql, useQuery} from '@apollo/client';
import ScreenLayout from '../components/ScreenLayout';
import Photo from '../components/feed/Photo';

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      isMe
      username
    }
  }
`;

const SEE_FEED_QUERY = gql`
  query seeFeed($lastId: Int) {
    seeFeed(lastId: $lastId) {
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

const rendItem = ({item}: any) => {
  return <Photo {...item} />;
};

export default function Feed() {
  const [refreshing, setRefreshing] = useState(false);
  const {data, loading, refetch, fetchMore} = useQuery(SEE_FEED_QUERY);

  const photos = data?.seeFeed;

  const refreshFeed = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const loadNewPhoto = () => {
    const photoLenght = data?.seeFeed?.length;
    const lastId = data?.seeFeed[photoLenght - 1]?.id;

    fetchMore({
      variables: {
        lastId,
      },
    });
  };

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshFeed}
            tintColor="white"
          />
        }
        onEndReached={loadNewPhoto}
        onEndReachedThreshold={0.02}
        data={photos}
        renderItem={rendItem}
        keyExtractor={item => item.id}
      />
    </ScreenLayout>
  );
}
