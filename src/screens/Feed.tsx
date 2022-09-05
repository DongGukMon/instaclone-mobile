import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {logUserOut} from '../apollo';
import {gql, useQuery} from '@apollo/client';

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      isMe
      username
    }
  }
`;

export default function Feed() {
  const {data} = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username: 'nicolas',
    },
  });
  const loadProfile = () => {
    console.log(data);
  };
  return (
    <View>
      <Text>Hi guys~</Text>
      <TouchableOpacity onPress={() => logUserOut()}>
        <Text>로그아웃</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => loadProfile()}>
        <Text>프로필 보기</Text>
      </TouchableOpacity>
    </View>
  );
}
