import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components/native';

interface UsernameRowProps {
  username: string;
  avatar?: string;
  children?: React.ReactNode;
}

const UsernameRowContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

const AvatarContainer = styled.View`
  background-color: gray;
  border-radius: 30px;
  overflow: hidden;
  width: 32px;
  height: 32px;
`;

const FatText = styled.Text`
  color: white;
  margin-left: 10px;
  font-weight: 600;
  font-size: 16px;
`;

function UsernameRow({username, avatar, children = null}: UsernameRowProps) {
  const {navigate} = useNavigation();
  return (
    <UsernameRowContainer>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => navigate('Profile' as never, {username} as never)}>
        <AvatarContainer>
          <Image
            style={{width: '100%', height: '100%'}}
            source={{uri: avatar}}
          />
        </AvatarContainer>
        <FatText>{username}</FatText>
      </TouchableOpacity>
      {children}
    </UsernameRowContainer>
  );
}

export default React.memo(UsernameRow);
