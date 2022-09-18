import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import styled from 'styled-components/native';
import {colors} from '../../colors';

const Container = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
`;
const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const Column = styled.View``;
const Avatar = styled.Image`
  width: 100%;
  height: 100%;
`;
const AvatarContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: ${colors.lightGray};
  border-radius: 25px;
  margin-right: 10px;
`;
const UnreadText = styled.Text`
  color: white;
  font-size: 14px;
  margin-top: 5px;
`;
const Username = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;
const UnreadDot = styled.View`
  width: 8px;
  height: 8px;
  background-color: tomato;
  border-radius: 4px;
  margin-right: 10px;
`;

interface RoomItemProps {
  avatar: string | null;
  username: string;
  unreadTotal: number;
  id: number;
}

const RoomItem = ({avatar, username, unreadTotal, id}: RoomItemProps) => {
  const {navigate} = useNavigation();
  const goToRoom = () =>
    navigate('Room' as never, {roomId: id, talkingTo: username} as never);

  return (
    <Container onPress={goToRoom}>
      <Row>
        <AvatarContainer>
          {avatar && <Avatar source={{uri: avatar}} />}
        </AvatarContainer>
        <Column>
          <Username>{username}</Username>
          <UnreadText>
            {unreadTotal} unread message{unreadTotal !== 1 && 's'}
          </UnreadText>
        </Column>
      </Row>
      {unreadTotal !== 0 && <UnreadDot />}
    </Container>
  );
};

export default React.memo(RoomItem);
