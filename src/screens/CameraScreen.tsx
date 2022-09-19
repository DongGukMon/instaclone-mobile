import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import styled from 'styled-components/native';
import {colors} from '../colors';
import CameraActions from '../components/camera/CameraActions';
import HeaderLeft from '../components/camera/HeaderLeft';
import HeaderRight from '../components/camera/HeaderRight';

const {height, width} = Dimensions.get('window');

const TakeBtn = styled.View`
  width: 90px;
  height: 90px;
  border-radius: 50px;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const InnerTakeBtn = styled(TakeBtn)`
  width: 80px;
  height: 80px;
  border-color: black;
  border-width: 1px;
`;

const ActionsBox = styled.View`
  height: ${() => (height - 400) / 2 + 50}px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
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
  const [cameraPermission, setCameraPermission] = useState(false);
  const isFocused = useIsFocused();

  const [cameraDirection, setCameraDirection] = useState(false);
  const devices = useCameraDevices();
  const device = cameraDirection ? devices.front : devices.back;

  const camera = useRef<Camera>(null);

  const getPermission = async () => {
    const status = await Camera.getCameraPermissionStatus();
    if (status === 'authorized') {
      setCameraPermission(true);
    } else {
      const result = await Camera.requestCameraPermission();
      if (result === 'authorized') {
        setCameraPermission(true);
      }
    }
  };

  const takePhoto = async () => {
    if (!cameraPermission || camera.current === null) {
      return;
    }

    //안드로이드 에뮬레이터 문제로 takePhoto가 동작하지 않기 때문에
    //개발단계에서는 takeSnapshot으로 대체
    const photo =
      Platform.OS === 'ios'
        ? await camera.current.takePhoto()
        : await camera.current.takeSnapshot({});

    setTakedPhoto(`file://${photo.path}`);
  };

  const goToUpload = () => {
    navigation.navigate('Upload' as never, {uri: takedPhoto} as never);
    setTakedPhoto('');
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
      {isFocused && <StatusBar hidden={true} />}
      {isFocused && device !== null && device !== undefined && (
        <Camera
          style={{position: 'absolute', width, height}}
          device={device}
          isActive={true}
          ref={camera}
          photo={true}
        />
      )}
      {takedPhoto.length !== 0 && (
        <Image
          source={{
            uri: takedPhoto,
          }}
          style={{position: 'absolute', width, height}}
        />
      )}
      <View
        style={{
          height: (height - 400) / 2 - 50,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}></View>

      <ActionsBox>
        {takedPhoto.length === 0 ? (
          <CameraActions
            goToAlbum={goToAlbum}
            setCameraDirection={setCameraDirection}
            cameraDirection={cameraDirection}>
            <TouchableOpacity
              onPress={() => {
                takePhoto();
              }}>
              <TakeBtn>
                <InnerTakeBtn />
              </TakeBtn>
            </TouchableOpacity>
          </CameraActions>
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
