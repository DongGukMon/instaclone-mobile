import React from 'react';
import styled from 'styled-components/native';
import {colors} from '../../colors';

export const FatText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: 600;
`;
export const NextBtn = styled.TouchableOpacity`
  background-color: ${colors.blue};
  width: 55px;
  height: 25px;
  border-radius: 3px;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
`;
export default function HeaderRight({
  onPress,
  isTaked = true,
  text = 'NEXT',
}: {
  onPress: Function;
  isTaked?: boolean;
  text?: string;
}) {
  if (isTaked) {
    return (
      <NextBtn onPress={onPress}>
        <FatText>{text}</FatText>
      </NextBtn>
    );
  } else {
    return null;
  }
}
