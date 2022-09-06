import {View, Text, TouchableOpacity, Image, FlatList} from 'react-native';
import React from 'react';
import {logUserOut} from '../apollo';
import {gql, useQuery} from '@apollo/client';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextInput} from '../components/auth/AuthShared';
import ScreenLayout from '../components/ScreenLayout';
import Photo from '../components/feed/Photo';
import Photoheader from '../components/feed/PhotoHeader';
import Comments from '../components/feed/Comments';
import Comment from '../components/feed/Comment';
import ActionButtons from '../components/feed/ActionButtons';

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
  const {data, loading} = useQuery(SEE_FEED_QUERY);
  const photos = data?.seeFeed;

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        data={photos}
        renderItem={rendItem}
        keyExtractor={item => item.id}
      />
    </ScreenLayout>
  );
}
