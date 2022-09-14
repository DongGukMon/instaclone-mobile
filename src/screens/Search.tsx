import {gql, useLazyQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useMemo} from 'react';
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
import {logUserOut} from '../apollo';
import DismissKeyboard from '../components/DismissKeyboard';

import ScreenLayout from '../components/ScreenLayout';

const {width} = Dimensions.get('window');

const SEARCH_PHOTOS_QUERY = gql`
  query searchPhotos($keyword: String!, $page: Int!) {
    searchPhotos(keyword: $keyword, page: $page) {
      id
      file
    }
  }
`;

const PhotosContainer = styled.View`
  padding: 40px 10px 10px 10px;
  flex: 1;
  background-color: black;
`;

const SearchBox = (
  searchPhotosQuery: Function,
  setValue: Function,
  handleSubmit: Function,
) => {
  const onValid = (data: any) => {
    searchPhotosQuery({variables: {keyword: data?.keyword, page: 1}});
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

  const [searchPhotosQuery, {data, loading, called}] =
    useLazyQuery(SEARCH_PHOTOS_QUERY);

  useEffect(() => {
    register('keyword', {
      required: true,
    });
    setOptions({
      headerTitle: () => SearchBox(searchPhotosQuery, setValue, handleSubmit),
    });
  }, []);

  const _renderItem = ({item}: {item: {id: number; file: string}}) => {
    const {id, file} = item;
    return (
      <TouchableOpacity
        onPress={() => {}}
        style={{width: (width - 20) / 3, height: (width - 20) / 3, padding: 2}}>
        <Image source={{uri: file}} style={{width: '100%', height: '100%'}} />
      </TouchableOpacity>
    );
  };

  return (
    <DismissKeyboard>
      {called ? (
        loading ? (
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
        ) : (
          <PhotosContainer>
            <FlatList
              contentContainerStyle={{flex: 1}}
              data={data?.searchPhotos}
              keyExtractor={item => item.id + ''}
              renderItem={_renderItem}
              numColumns={3}
            />
          </PhotosContainer>
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
    </DismissKeyboard>
  );
}
