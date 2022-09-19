import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import styled from 'styled-components/native';
const ActionsContainer = styled.View`
  flex-direction: row;
  flex: 1;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 10px;
`;

const ActionBtn = styled.TouchableOpacity``;

interface CameraActionsProps {
  goToAlbum: Function;
  children: React.ReactNode;
  cameraDirection: boolean;
  setCameraDirection: Function;
}

export default function CameraActions({
  goToAlbum,
  children,
  cameraDirection,
  setCameraDirection,
}: CameraActionsProps) {
  return (
    <ActionsContainer>
      <ActionBtn onPress={goToAlbum}>
        <Icon name="albums" size={30} color="white" />
      </ActionBtn>
      {children}
      <ActionBtn onPress={() => setCameraDirection(!cameraDirection)}>
        <Icon name="camera-reverse" size={30} color="white" />
      </ActionBtn>
    </ActionsContainer>
  );
}
