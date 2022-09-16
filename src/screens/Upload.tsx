import {gql, useMutation} from '@apollo/client';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../colors';
import ScreenLayout from '../components/ScreenLayout';
import {ReactNativeFile} from 'apollo-upload-client';
import HeaderRight, {FatText, NextBtn} from '../components/camera/HeaderRight';

const {height, width} = Dimensions.get('window');

const PostImage = styled.Image`
  width: 100%;
  height: 400px;
`;

const CaptionInput = styled.TextInput`
  width: 100%;
  height: 50px;
  background-color: white;
  color: black;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;

const CaptionContainer = styled.View`
  width: 80%;
  margin-top: 10px;
`;

const Container = styled.View`
  flex: 1;
  align-items: center;
`;

const UPLOAD_PHOTO_MUTATION = gql`
  mutation uploadPhoto($file: Upload!, $caption: String) {
    uploadPhoto(file: $file, caption: $caption) {
      id
      user {
        id
        username
        avatar
      }
      file
      caption
      likes
      commentNumber
      comments {
        id
        payload
        user {
          username
          avatar
        }
        isMine
        createdAt
      }
      createdAt
      isMine
      isLiked
    }
  }
`;

export default function Upload() {
  const navigation = useNavigation();
  const {handleSubmit, setValue, register} = useForm({
    defaultValues: {caption: ''},
  });

  const {
    params: {uri},
  } = useRoute<any>();

  const uploadPhotoUpload = (cache: any, data: any) => {
    if (data) {
      cache.modify({
        fields: {
          seeFeed: (prev: any) => {
            return [data?.data?.uploadPhoto, ...prev];
          },
        },
      });
      navigation.navigate('TabsNav' as never);
    }
  };

  const [uploadPhotoMutation, {loading}] = useMutation(UPLOAD_PHOTO_MUTATION, {
    update: uploadPhotoUpload,
  });

  const onValid = ({caption}: any) => {
    if (!loading) {
      const file = new ReactNativeFile({
        uri,
        name: uri.split('/').toString(),
        type: 'image/jpg',
      });

      uploadPhotoMutation({
        variables: {
          file,
          caption,
        },
      });
    }
  };

  useEffect(() => {
    register('caption', {
      required: true,
    });
  }, [register]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <NextBtn onPress={handleSubmit(onValid)}>
          <FatText>UPLOAD</FatText>
        </NextBtn>
      ),
    });
  }, []);

  return (
    <ScreenLayout>
      <Container>
        <PostImage source={{uri}} />
        <CaptionContainer>
          <CaptionInput
            placeholder="caption"
            onChangeText={(text: string) => setValue('caption', text)}
            returnKeyType="done"
          />
        </CaptionContainer>
      </Container>
    </ScreenLayout>
  );
}
