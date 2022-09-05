import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components/native';

interface PhotoHeaderProps {
  username: string;
  avatar?: string;
}

const PhotoHeaderContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
`;

const AvatarContainer = styled.View`
  background-color: gray;
  border-radius: 30;
  overflow: hidden;
  width: 32;
  height: 32;
`;

const FatText = styled.Text`
  color: white;
  margin-left: 10px;
  font-weight: 600;
  font-size: 16px;
`;

export default function Photoheader({username, avatar}: PhotoHeaderProps) {
  return (
    <PhotoHeaderContainer>
      <TouchableOpacity>
        <AvatarContainer>
          <Image
            style={{width: '100%', height: '100%'}}
            source={{uri: avatar}}
          />
        </AvatarContainer>
      </TouchableOpacity>
      <FatText>{username}</FatText>
    </PhotoHeaderContainer>
  );
}
