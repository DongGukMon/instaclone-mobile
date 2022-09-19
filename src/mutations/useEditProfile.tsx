import {gql, useMutation} from '@apollo/client';
import React from 'react';
import useUser from '../hooks/me';

const EDIT_PROFILE_MUATION = gql`
  mutation editProfile(
    $firstName: String
    $lastName: String
    $username: String
    $email: String
    $password: String
    $bio: String
    $avatar: Upload
  ) {
    editProfile(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
      bio: $bio
      avatar: $avatar
    ) {
      ok
      error
    }
  }
`;

const useEditProfile = (uri: string) => {
  const {user} = useUser();
  const editProfileUpdate = (cache: any, result: any) => {
    const {ok, error} = result?.data?.editProfile;

    if (ok) {
      cache.modify({
        id: `User:${user.id}`,
        fields: {avatar: () => uri},
      });
    } else if (error) {
      console.log(error);
    }
  };
  const [editProfileMutation, {loading}] = useMutation(EDIT_PROFILE_MUATION, {
    update: editProfileUpdate,
  });

  return {editProfileMutation, loading};
};

export default useEditProfile;
