import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import {colors} from '../colors';
import CameraActions from '../components/camera/CameraActions';
import HeaderLeft from '../components/camera/HeaderLeft';
import HeaderRight from '../components/camera/HeaderRight';

const {width, height} = Dimensions.get('window');

const ActionsBox = styled.View`
  height: ${() => (height - 400) / 2 + 50}px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const RephotoContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const RephotoBtn = styled.TouchableOpacity`
  height: 80px;
  width: 100px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  background-color: white;
`;
const FatText = styled.Text`
  color: black;
  font-weight: 600;
  font-size: 16px;
`;

export default function CameraScreen() {
  const navigation = useNavigation();
  const [takedPhoto, setTakedPhoto] = useState('');

  const getPermission = async () => {};

  const goToUpload = () => {
    navigation.navigate('Upload' as never, {uri: takedPhoto} as never);
  };

  useEffect(() => {
    getPermission();
  }, []);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRight isTaked={takedPhoto.length !== 0} onPress={goToUpload} />
      ),
      headerBackImage: () => <HeaderLeft onPress={goBack} />,
    });
  }, [takedPhoto]);

  const goToAlbum = () => {
    navigation.navigate('Album' as never);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          height: (height - 400) / 2 - 50,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}></View>
      <ActionsBox>
        {takedPhoto.length === 0 ? (
          <CameraActions
            goToAlbum={goToAlbum}
            takedPhoto={takedPhoto}
            setTakedPhoto={setTakedPhoto}
          />
        ) : (
          <RephotoContainer>
            <RephotoBtn onPress={() => setTakedPhoto('')}>
              <FatText>다시 찍기</FatText>
            </RephotoBtn>
          </RephotoContainer>
        )}
      </ActionsBox>
    </View>
  );
}
