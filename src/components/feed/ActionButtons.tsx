import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';

interface ActionButtonsProps {
  isLiked: boolean;
  likes: number;
}

const BaseContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ActionButtonContainewr = styled.View`
  padding: 10px 5px;
`;

const ActionButton = styled.TouchableOpacity`
  margin: 0px 5px;
`;

const Likes = styled.Text`
  font-weight: 600;
  font-size: 16px;
  color: white;
  margin: 5px 0px 5px 5px;
`;

export default function ActionButtons({isLiked, likes}: ActionButtonsProps) {
  const [isLikedState, setIsLikedState] = useState(isLiked);
  return (
    <ActionButtonContainewr>
      <BaseContainer>
        <BaseContainer>
          <ActionButton onPress={() => setIsLikedState(!isLikedState)}>
            <Icon
              name={isLikedState ? 'heart' : 'heart-outline'}
              color={isLikedState ? 'red' : 'white'}
              size={30}
            />
          </ActionButton>
          <ActionButton>
            <Icon name="chatbubbles-outline" color="white" size={30} />
          </ActionButton>
          <ActionButton>
            <Icon name="send-outline" color="white" size={30} />
          </ActionButton>
        </BaseContainer>
        <View>
          <ActionButton>
            <Icon name="bookmark-outline" color="white" size={30} />
          </ActionButton>
        </View>
      </BaseContainer>
      <Likes>{likes === 1 ? `1 like` : `${likes} likes`}</Likes>
    </ActionButtonContainewr>
  );
}
