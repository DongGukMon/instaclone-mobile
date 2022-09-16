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
const TakeBtn = styled.View`
  width: 90px;
  height: 90px;
  border-radius: 50px;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const ActionBtn = styled.TouchableOpacity``;
const InnerTakeBtn = styled(TakeBtn)`
  width: 80px;
  height: 80px;
  border-color: black;
  border-width: 1px;
`;

interface CameraActionsProps {
  goToAlbum: Function;
  takedPhoto: string;
  setTakedPhoto: Function;
}

export default function CameraActions({
  goToAlbum,
  takedPhoto,
  setTakedPhoto,
}: CameraActionsProps) {
  return (
    <ActionsContainer>
      <ActionBtn onPress={goToAlbum}>
        <Icon name="albums" size={30} color="white" />
      </ActionBtn>
      <ActionBtn
        onPress={() => {
          setTakedPhoto('1');
        }}>
        <TakeBtn>
          <InnerTakeBtn />
        </TakeBtn>
      </ActionBtn>
      <ActionBtn>
        <Icon name="camera-reverse" size={30} color="white" />
      </ActionBtn>
    </ActionsContainer>
  );
}
