import {gql, useMutation, useQuery} from '@apollo/client';
import {useRoute} from '@react-navigation/native';
import React from 'react';
import {colors} from '../colors';
import useUser from '../hooks/me';

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

export default function useToggleMutation() {
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

  const [followMutation, {loading: followLoading}] = useMutation(
    FOLLOW_MUTATION,
    {
      update: followToggleUpdate,
    },
  );

  const [unfollowMutation, {loading: unfollowLading}] = useMutation(
    UNFOLLOW_MUTATION,
    {
      update: followToggleUpdate,
    },
  );

  const toggleLikes = (username: string, isFollowing: boolean) => {
    !followLoading &&
      !unfollowLading &&
      (isFollowing
        ? unfollowMutation({variables: {username}})
        : followMutation({variables: {username}}));
  };
  return {toggleLikes};
}
