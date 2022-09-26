import {gql, useQuery} from '@apollo/client';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions, FlatList, Image} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../colors';
import ScreenLayout from '../components/ScreenLayout';
import useUser from '../hooks/me';
import useToggleMutation from '../mutations/useToggleMutation';
import {logUserOut} from '../apollo';
import {TouchableOpacity} from 'react-native-gesture-handler';

const {width} = Dimensions.get('window');

interface SeeProfileTypes {
  id: number;
  firstName: string;
  lastName?: string;
  username: string;
  bio?: string;
  avatar?: string;
  totalFollowing: number;
  totalFollowers: number;
  isMe: boolean;
  isFollowing: boolean;
  totalPhotos: number;
  photos: [
    {
      id: number;
      file: string;
    },
  ];
}

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!, $page: Int!) {
    seeProfile(username: $username) {
      id
      firstName
      lastName
      username
      bio
      avatar
      totalFollowing
      totalFollowers
      isMe
      isFollowing
      totalPhotos
      photos(page: $page) {
        id
        file
      }
    }
  }
`;

const Conatiner = styled.View`
  flex: 1;
  padding: 10px;
`;

const InfoContainer = styled.View`
  border-color: tomato;
  border-width: 1px;
`;
const Infos = styled.View``;
const AvatarContainer = styled.View`
  background-color: gray;
  border-radius: 50px;
  overflow: hidden;
  width: 80px;
  height: 80px;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;
const Avatar = styled.Image`
  width: 100%;
  height: 100%;
`;
const ProfileText = styled.Text`
  font-size: 16px;
  color: white;
`;
const FatProfileText = styled(ProfileText)`
  font-weight: 600;
`;

const ProfileActions = styled.View``;
const PhotoList = styled.View`
  margin-top: 20px;
  flex: 1;
`;

const Counter = styled.View`
  justify-content: center;
  align-items: center;
  width: ${(width - 130) / 3}px;
`;

const Column = styled.View``;
const Row = styled.View`
  flex-direction: row;
`;

const ActionBtn = styled.TouchableOpacity`
  background-color: ${(props: any) =>
    props.isFollowing ? colors.lightGray : colors.blue};
  width: ${(props: any) => (props.isMe ? '100%' : (width - 30) / 2 + 'px')};

  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-top: 15px;
  border-radius: 5px;
`;

export default function Profile() {
  const {navigate, setOptions} = useNavigation();
  const {toggleLikes} = useToggleMutation();

  const {params}: any = useRoute();
  const {user} = useUser();

  const profileUsername = params?.username ? params.username : user.username;
  const {data, loading} = useQuery(SEE_PROFILE_QUERY, {
    variables: {username: profileUsername, page: 1},
  });

  useEffect(() => {
    setOptions({title: profileUsername});
  }, []);

  const {
    avatar,
    totalFollowing,
    totalFollowers,
    isMe,
    isFollowing,
    photos,
    totalPhotos,
  }: SeeProfileTypes = data?.seeProfile ? data.seeProfile : {};

  const _renderItem = ({item}: {item: {id: number; file: string}}) => {
    const {id, file} = item;
    const goToDetail = () =>
      navigate('Detail' as never, {photoId: id} as never);
    return (
      <TouchableOpacity
        onPress={goToDetail}
        style={{width: (width - 20) / 3, height: (width - 20) / 3, padding: 2}}>
        <Image source={{uri: file}} style={{width: '100%', height: '100%'}} />
      </TouchableOpacity>
    );
  };

  return (
    <ScreenLayout loading={loading}>
      <Conatiner>
        <Column>
          <Row style={{justifyContent: 'space-between', alignItems: 'center'}}>
            <Column>
              <AvatarContainer>
                <Avatar source={{uri: avatar}} />
              </AvatarContainer>
              <FatProfileText>{profileUsername}</FatProfileText>
            </Column>
            <Row
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: width - 130,
                padding: 10,
              }}>
              <Counter>
                <FatProfileText>{totalPhotos}</FatProfileText>
                <View style={{height: 3}} />
                <ProfileText>게시물</ProfileText>
              </Counter>
              <Counter>
                <FatProfileText>{totalFollowers}</FatProfileText>
                <View style={{height: 3}} />
                <ProfileText>팔로워</ProfileText>
              </Counter>
              <Counter>
                <FatProfileText>{totalFollowing}</FatProfileText>
                <View style={{height: 3}} />
                <ProfileText>팔로잉</ProfileText>
              </Counter>
            </Row>
          </Row>
          <ProfileActions>
            {isMe ? (
              <ActionBtn
                onPress={() => navigate('EditProfile' as never)}
                isMe={isMe}
                style={{backgroundColor: colors.lightGray}}>
                <FatProfileText style={{color: 'black', opacity: 0.9}}>
                  Edit Profile
                </FatProfileText>
              </ActionBtn>
            ) : (
              <Row style={{justifyContent: 'space-between'}}>
                <ActionBtn
                  isMe={isMe}
                  isFollowing={isFollowing}
                  onPress={() => {
                    toggleLikes(profileUsername, isFollowing);
                  }}>
                  <FatProfileText
                    style={isFollowing && {color: 'black', opacity: 0.9}}>
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </FatProfileText>
                </ActionBtn>
                <ActionBtn
                  isMe={isMe}
                  isFollowing={isFollowing}
                  style={{backgroundColor: colors.lightGray}}>
                  <FatProfileText style={{color: 'black', opacity: 0.9}}>
                    Message
                  </FatProfileText>
                </ActionBtn>
              </Row>
            )}
          </ProfileActions>
        </Column>
        <PhotoList>
          <FlatList
            data={photos?.slice().reverse()}
            keyExtractor={(item: any) => item.id}
            renderItem={_renderItem}
            numColumns={3}
          />
        </PhotoList>
      </Conatiner>
    </ScreenLayout>
  );
}
