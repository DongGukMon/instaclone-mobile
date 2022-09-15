import {gql, useMutation} from '@apollo/client';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';

interface PhotoIconProps {
  iconName: string;
  onPress: Function;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

const ActionButton = styled.TouchableOpacity`
  margin: 0px 5px;
`;

const PhotoIcon = ({
  iconName,
  onPress,
  isLiked,
  isBookmarked,
}: PhotoIconProps) => {
  return (
    <ActionButton onPress={onPress}>
      <Icon
        name={isLiked || isBookmarked ? iconName : `${iconName}-outline`}
        color="white"
        size={30}
      />
    </ActionButton>
  );
};

export default React.memo(PhotoIcon);
