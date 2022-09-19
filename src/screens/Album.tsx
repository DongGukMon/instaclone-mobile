import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, Dimensions, ImageBackground, Alert, View} from 'react-native';
import styled from 'styled-components/native';

import {PermissionsAndroid, Platform} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {useNavigation, useRoute} from '@react-navigation/native';
import HeaderLeft from '../components/camera/HeaderLeft';
import HeaderRight from '../components/camera/HeaderRight';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../colors';
import useEditProfile from '../mutations/useEditProfile';
import {ReactNativeFile} from 'apollo-upload-client';

const {width} = Dimensions.get('window');

const NotAllowPermissionContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const FatText = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: 600;
`;

const Container = styled.View`
  flex: 1;
  background-color: black;
`;
const UpperConatiner = styled.ImageBackground`
  flex: 1;
`;
const LowerContainer = styled.View`
  flex: 1;
`;

const ImageContainer = styled.TouchableOpacity`
  width: ${() => width / 3}px;
  height: ${() => width / 3}px;
  border-width: ${({isFocused}: {isFocused: boolean}) =>
    isFocused ? '1px' : '0px'};
  border-color: ${({isFocused}: {isFocused: boolean}) =>
    isFocused ? colors.blue : null};
`;

export default function Album() {
  const [snapshots, setSnapshots] = useState<any>([]);
  const [selectedPhoto, setSelectedPhoto] = useState('');
  const navigation = useNavigation();
  const {params} = useRoute();

  const getSnapshots = async () => {
    const result = await CameraRoll.getPhotos({
      first: 50,
      assetType: 'Photos',
    });
    setSelectedPhoto(result.edges[0]?.node.image.uri);
    setSnapshots(result?.edges);
  };

  const hasIosPermission = async () => {
    try {
      const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (result === RESULTS.GRANTED) {
        getSnapshots();
      }
    } catch (error) {
      console.log('askPermission', error);
    }
  };

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      getSnapshots();
    }
    const status = await PermissionsAndroid.request(permission);
    if (status === 'granted') {
      getSnapshots();
    }
  }

  const goToUpload = () => {
    navigation.goBack();
    navigation.navigate('Upload' as never, {uri: selectedPhoto} as never);
  };

  useEffect(() => {
    Platform.OS === 'ios' ? hasIosPermission() : hasAndroidPermission();
  }, []);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const {editProfileMutation, loading: editLoading} =
    useEditProfile(selectedPhoto);

  const excuteEdit = () => {
    if (!editLoading) {
      const file = new ReactNativeFile({
        uri: selectedPhoto,
        name: selectedPhoto.split('/').toString(),
        type: 'image/jpg',
      });
      navigation.goBack();
      editProfileMutation({
        variables: {
          avatar: file,
        },
      });
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        params ? (
          <HeaderRight onPress={excuteEdit} text="Edit" />
        ) : (
          <HeaderRight onPress={goToUpload} />
        ),
      headerBackImage: () => <HeaderLeft onPress={goBack} />,
    });
  }, [selectedPhoto]);

  const _renderItem = ({item}: any) => {
    const {
      node: {
        image: {uri},
      },
    } = item;
    const isFocused = uri === selectedPhoto;

    return (
      <ImageBackground resizeMode="cover" source={{uri}}>
        <ImageContainer
          isFocused={isFocused}
          onPress={() => {
            setSelectedPhoto(uri);
          }}></ImageContainer>
        {isFocused && (
          <View style={{position: 'absolute', bottom: 5, right: 5}}>
            <Icon name="checkmark" size={15} color={colors.blue} />
          </View>
        )}
      </ImageBackground>
    );
  };
  return (
    <Container>
      <UpperConatiner
        source={selectedPhoto.length === 0 ? {} : {uri: selectedPhoto}}
      />
      <LowerContainer>
        {snapshots.length === 0 ? (
          <NotAllowPermissionContainer>
            <FatText>갤러리 열람 권한을 확인해주세요</FatText>
          </NotAllowPermissionContainer>
        ) : (
          <FlatList
            numColumns={3}
            data={snapshots}
            keyExtractor={item => item.node.image.filename}
            renderItem={_renderItem}
          />
        )}
      </LowerContainer>
    </Container>
  );
}
