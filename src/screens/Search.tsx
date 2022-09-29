import {gql, useLazyQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import DismissKeyboard from '../components/DismissKeyboard';
import UsernameRow from '../components/feed/UsernameRow';
import {FollowBtn, FollowText} from '../components/shared';
import useToggleMutation from '../mutations/useToggleMutation';

const {width} = Dimensions.get('window');

const SEARCH_PHOTOS_QUERY = gql`
  query searchPhotos($keyword: String!, $page: Int!) {
    searchPhotos(keyword: $keyword, page: $page) {
      id
      file
    }
  }
`;

const SEARCH_USERS_QUERY = gql`
  query searchUsers($keyword: String!, $lastId: Int) {
    searchUsers(keyword: $keyword, lastId: $lastId) {
      id
      username
      avatar
      isFollowing
      isMe
    }
  }
`;

const ResultContainer = styled.View`
  padding: 10px;
  flex: 1;
  background-color: black;
`;

const SearchTypeText = styled.Text`
  color: ${(props: {isFocus: boolean}) =>
    props.isFocus ? 'white' : 'rgba(255,255,255,0.7)'};
  font-size: 20px;
  font-weight: ${(props: {isFocus: boolean}) => (props.isFocus ? 600 : 400)};
  margin-bottom: 10px;
`;

const SearchTypeContainer = styled.View`
  height: 50px;
  flex-direction: row;
  margin-top: 10px;
`;

const SearchTypeBtn = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  border-bottom-width: 2px;

  border-color: ${(props: {isFocus: boolean}) =>
    props.isFocus ? 'white' : 'black'};
`;

const SearchBox = (
  searchPhotosQuery: Function,
  searchUsersQuery: Function,
  setValue: Function,
  handleSubmit: Function,
) => {
  const onValid = (data: any) => {
    searchPhotosQuery({variables: {keyword: data?.keyword, page: 1}});
    searchUsersQuery({variables: {keyword: data?.keyword}});
  };

  return (
    <TextInput
      style={{
        backgroundColor: 'white',
        width: width * 0.8,
        height: 40,
        borderRadius: 5,
        paddingLeft: 10,
        fontSize: 16,
      }}
      placeholderTextColor="black"
      placeholder="Search photos"
      autoCapitalize="none"
      returnKeyLabel="Search"
      returnKeyType="search"
      autoCorrect={false}
      onChangeText={(text: string) => setValue('keyword', text)}
      onSubmitEditing={handleSubmit(onValid)}
    />
  );
};

export default function Search() {
  const {navigate, setOptions} = useNavigation();
  const {setValue, handleSubmit, register} = useForm();

  const [focusItem, setFocusItem] = useState('users');

  const [searchPhotosQuery, {data, loading, called}] =
    useLazyQuery(SEARCH_PHOTOS_QUERY);

  const [
    searchUsersQuery,
    {data: userData, loading: userLoading, called: userCalled},
  ] = useLazyQuery(SEARCH_USERS_QUERY);

  useEffect(() => {
    register('keyword', {
      required: true,
    });
    setOptions({
      headerTitle: () =>
        SearchBox(searchPhotosQuery, searchUsersQuery, setValue, handleSubmit),
    });
  }, []);

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

  const {toggleLikes} = useToggleMutation();

  const userRenderItem = (item: {
    item: {
      username: string;
      avatar?: string;
      id: number;
      isFollowing: boolean;
      isMe: boolean;
    };
  }) => {
    const {username, avatar, isMe, isFollowing} = item?.item;
    return (
      <View style={{height: 70}}>
        <UsernameRow username={username} avatar={avatar}>
          {!isMe && (
            <FollowBtn
              isFollowing={isFollowing}
              onPress={() => toggleLikes(username, isFollowing)}>
              <FollowText isFollowing={isFollowing}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </FollowText>
            </FollowBtn>
          )}
        </UsernameRow>
      </View>
    );
  };

  return (
    <DismissKeyboard>
      <View style={{backgroundColor: 'black', flex: 1}}>
        <SearchTypeContainer>
          <SearchTypeBtn
            isFocus={focusItem === 'users'}
            onPress={() => setFocusItem('users')}>
            <SearchTypeText isFocus={focusItem === 'users'}>
              Users
            </SearchTypeText>
          </SearchTypeBtn>
          <SearchTypeBtn
            isFocus={focusItem === 'photos'}
            onPress={() => setFocusItem('photos')}>
            <SearchTypeText isFocus={focusItem === 'photos'}>
              Photos
            </SearchTypeText>
          </SearchTypeBtn>
        </SearchTypeContainer>
        {called && userCalled ? (
          loading || userLoading ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                backgroundColor: 'black',
              }}>
              <ActivityIndicator color="white" />
              <Text style={{color: 'white', marginTop: 10}}>검색중입니다.</Text>
            </View>
          ) : focusItem === 'users' ? (
            <ResultContainer>
              <FlatList
                contentContainerStyle={{flex: 1}}
                data={userData?.searchUsers}
                keyExtractor={item => item.id + ''}
                renderItem={userRenderItem}
              />
            </ResultContainer>
          ) : (
            <ResultContainer>
              <FlatList
                contentContainerStyle={{
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}
                data={data?.searchPhotos}
                keyExtractor={item => item.id + ''}
                renderItem={_renderItem}
              />
            </ResultContainer>
          )
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              backgroundColor: 'black',
            }}>
            <Text style={{color: 'white'}}>검색어를 입력해주세요</Text>
          </View>
        )}
      </View>
    </DismissKeyboard>
  );
}
