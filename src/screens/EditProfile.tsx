import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {KeyboardAvoidingView} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../colors';
import ScreenLayout from '../components/ScreenLayout';
import useUser from '../hooks/me';

const AvatarBox = styled.View`
  width: 100%;
  height: 200px;

  justify-content: center;
  align-items: center;
`;
const AvatarContainer = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 100px;
  background-color: ${colors.lightGray};
`;
const Avatar = styled.Image`
  width: 100%;
  height: 100%;
`;
const AvatarChangeBtn = styled.TouchableOpacity`
  width: 120px;
  height: 30px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;
const AvatarChangeText = styled.Text`
  color: ${colors.blue};
  font-size: 14px;
  font-weight: 600;
`;
const Column = styled.View`
  justify-content: center;
  align-items: center;
`;
const Separator = styled.View`
  width: 100%;
  height: 0.25px;
  background-color: ${colors.lightGray};
`;

const Row = styled.View`
  flex-direction: row;
`;

const FatText = styled.Text``;
const LabelConatiner = styled.View``;
const ContentContainer = styled.View;

const EditProfile = () => {
  const {user} = useUser();
  const {navigate} = useNavigation();
  const goToAlbum = () =>
    navigate('Album' as never, {from: 'editProfile'} as never);
  return (
    <ScreenLayout>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior="padding"
        keyboardVerticalOffset={100}>
        <AvatarBox>
          <Column>
            <AvatarContainer>
              <Avatar source={{uri: user.avatar}} />
            </AvatarContainer>
            <AvatarChangeBtn onPress={goToAlbum}>
              <AvatarChangeText>프로필 사진 바꾸기</AvatarChangeText>
            </AvatarChangeBtn>
          </Column>
        </AvatarBox>
        <Separator />
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
};

export default EditProfile;
