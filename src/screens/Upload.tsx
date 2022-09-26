import {gql, useMutation} from '@apollo/client';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import styled from 'styled-components/native';

import ScreenLayout from '../components/ScreenLayout';
import {ReactNativeFile} from 'apollo-upload-client';
import {FatText, NextBtn} from '../components/camera/HeaderRight';
import DismissKeyboard from '../components/DismissKeyboard';
import {PHOTO_FRAGMENT} from '../fragments';

const PostImage = styled.Image`
  width: 100%;
  height: 300px;
`;

const CaptionInput = styled.TextInput`
  width: 100%;
  height: 50px;
  background-color: white;
  color: black;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding-left: 10px;
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
      ...PhotoFragment
    }
  }
  ${PHOTO_FRAGMENT}
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
      const id = `Photo:${data?.data?.uploadPhoto?.id}`;
      const meId = `User:${data?.data?.uploadPhoto?.user?.id}`;

      cache.writeFragment({
        id,
        fragment: PHOTO_FRAGMENT,
        data: data?.data?.uploadPhoto,
      });

      cache.modify({
        fields: {
          seeFeed: (prev: any) => {
            return [{__ref: id}, ...prev];
          },
        },
      });

      cache.modify({
        id: meId,
        fields: {
          totalPhotos: (prev: number) => prev + 1,
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
    <DismissKeyboard>
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
    </DismissKeyboard>
  );
}
