import {gql, useMutation, useQuery} from '@apollo/client';
import {useRoute} from '@react-navigation/native';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import ScreenLayout from '../components/ScreenLayout';
import UsernameRow from '../components/feed/UsernameRow';
import {colors} from '../colors';
import useUser from '../hooks/me';
import useToggleMutation from '../mutations/useToggleMutation';
import {FollowBtn, FollowText} from '../components/shared';

interface PhotoTypes {
  avatar?: string;
  username: string;
  isMe: boolean;
  isFollowing: boolean;
  id: number;
}

const SEE_PHOTO_LIKES = gql`
  query seePhotoLikes($id: Int!) {
    seePhotoLikes(id: $id) {
      avatar
      username
      isMe
      isFollowing
      id
    }
  }
`;
export default function Likes() {
  const {
    params: {photoId: photoId},
  } = useRoute<any>();

  const {data, loading} = useQuery(SEE_PHOTO_LIKES, {variables: {id: photoId}});

  const {toggleLikes} = useToggleMutation();

  const renderItem = ({item}: {item: PhotoTypes}) => {
    const {username, avatar, isMe, isFollowing} = item;
    return (
      <UsernameRow username={username} avatar={avatar}>
        {!isMe && (
          <FollowBtn
            isFollowing={isFollowing}
            onPress={() => toggleLikes(username, isFollowing)}>
            <FollowText isFollowing={isFollowing}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </FollowText>
          </FollowBtn>
        )}
      </UsernameRow>
    );
  };

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        data={data?.seePhotoLikes}
        keyExtractor={photo => photo.username}
        renderItem={renderItem}
      />
    </ScreenLayout>
  );
}
