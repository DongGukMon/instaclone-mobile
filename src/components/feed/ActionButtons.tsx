import {gql, useMutation} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {TouchableOpacity, View} from 'react-native';
import styled from 'styled-components/native';
import PhotoIcon from './PhotoIcon';

interface ActionButtonsProps {
  isLiked: boolean;
  likes: number;
  id: number;
}

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      result
      error
    }
  }
`;

const BaseContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ActionButtonContainewr = styled.View`
  padding: 10px 5px;
`;

const LikeNumber = styled.Text`
  font-weight: 600;
  font-size: 16px;
  color: white;
  opacity: 0.8;
  margin: 7px 0px 5px 5px;
`;

function ActionButtons({isLiked, likes, id}: ActionButtonsProps) {
  const {navigate} = useNavigation();

  const toggleLikeUpdate = (
    cache: any,
    {
      data: {
        toggleLike: {ok, error},
      },
    }: any,
  ) => {
    if (ok) {
      cache.modify({
        id: `Photo:${id}`,
        fields: {
          likes: (prev: number) => (isLiked ? prev - 1 : prev + 1),
          isLiked: (prev: boolean) => !prev,
        },
      });
    } else if (error) {
      console.log(error);
    }
  };

  const [toggleLikeMutation, {loading}] = useMutation(TOGGLE_LIKE_MUTATION, {
    update: toggleLikeUpdate,
    onError: e => console.log(JSON.stringify(e, null, 1)),
    variables: {
      id,
    },
  });

  const goToLikes = useCallback(
    () => navigate('Likes' as never, {photoId: id} as never),
    [id],
  );

  const goToComments = () => {
    navigate('Comments' as never, {photoId: id} as never);
  };

  return (
    <ActionButtonContainewr>
      <BaseContainer>
        <BaseContainer>
          <PhotoIcon
            iconName={'heart'}
            onPress={() => {
              toggleLikeMutation();
            }}
            isLiked={isLiked}
          />
          <PhotoIcon iconName="chatbubbles" onPress={goToComments} />
          <PhotoIcon iconName="send" onPress={useCallback(() => {}, [])} />
        </BaseContainer>
        <View>
          <PhotoIcon iconName="bookmark" onPress={useCallback(() => {}, [])} />
        </View>
      </BaseContainer>
      <TouchableOpacity onPress={goToLikes}>
        <LikeNumber>{likes === 1 ? `1 like` : `${likes} likes`}</LikeNumber>
      </TouchableOpacity>
    </ActionButtonContainewr>
  );
}

export default React.memo(ActionButtons);
