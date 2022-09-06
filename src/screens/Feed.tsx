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
  query seeFeed {
    seeFeed {
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
  const {data, loading, refetch} = useQuery(SEE_FEED_QUERY);
  const photos = data?.seeFeed;

  const refreshFeed = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
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
        data={photos}
        renderItem={rendItem}
        keyExtractor={item => item.id}
      />
    </ScreenLayout>
  );
}
