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

const FOLLOW_MUTATION = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
      error
      id
    }
  }
`;

const UNFOLLOW_MUTATION = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
      error
      id
    }
  }
`;

const FollowText = styled.Text`
  color: white;
  font-weight: 600;
`;

const FollowBtn = styled.TouchableOpacity`
  background-color: ${colors.blue};
  width: 80px;
  height: 100%;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

export default function Likes() {
  const {
    params: {photoId: photoId},
  } = useRoute();

  const {
    user: {id: meId},
  } = useUser();

  const followToggleUpdate = (cache: any, followData: any) => {
    const loggedInUserId = `User:${meId}`;

    if (followData?.data?.unfollowUser) {
      const userId = `User:${followData?.data?.unfollowUser?.id}`;
      const {
        data: {
          unfollowUser: {ok},
        },
      } = followData;
      if (ok && loggedInUserId && userId) {
        cache.modify({
          id: userId,
          fields: {
            isFollowing: () => false,
            totalFollowers: (prev: number) => prev - 1,
          },
        });
        cache.modify({
          id: loggedInUserId,
          fields: {
            totalFollowing: (prev: number) => prev - 1,
          },
        });
      }
    } else if (followData?.data?.followUser) {
      const userId = `User:${followData?.data?.followUser?.id}`;
      const {
        data: {
          followUser: {ok},
        },
      } = followData;
      if (ok && loggedInUserId && userId) {
        cache.modify({
          id: userId,
          fields: {
            isFollowing: () => true,
            totalFollowers: (prev: number) => prev + 1,
          },
        });
        cache.modify({
          id: loggedInUserId,
          fields: {
            totalFollowing: (prev: number) => prev + 1,
          },
        });
      }
    }
  };

  const [followMutation] = useMutation(FOLLOW_MUTATION, {
    update: followToggleUpdate,
  });

  const [unfollowMutation] = useMutation(UNFOLLOW_MUTATION, {
    update: followToggleUpdate,
  });

  const {data, loading} = useQuery(SEE_PHOTO_LIKES, {variables: {id: photoId}});

  const toggleLikes = (username: string, isFollowing: boolean) => {
    isFollowing
      ? unfollowMutation({variables: {username}})
      : followMutation({variables: {username}});
  };

  const renderItem = ({item}: {item: PhotoTypes}) => {
    const {username, avatar, isMe, isFollowing} = item;
    return (
      <UsernameRow username={username} avatar={avatar}>
        {!isMe && (
          <FollowBtn onPress={() => toggleLikes(username, isFollowing)}>
            <FollowText>{isFollowing ? 'Unfollow' : 'Follow'}</FollowText>
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
