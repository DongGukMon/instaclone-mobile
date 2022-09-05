import {colors} from '../../colors';
import styled from 'styled-components/native';
import React from 'react';
import {ActivityIndicator} from 'react-native';

const Button = styled.TouchableOpacity`
  background-color: ${colors.blue};
  padding: 13px 10px;
  border-radius: 5px;
  width: 100%;
  opacity: ${(props: {disabled: boolean}) => (props.disabled ? 0.5 : 1)};
`;
const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
  text-align: center;
`;

type AuthButtonProps = {
  disabled: boolean;
  value: string;
  onPress: Function;
  loading: boolean;
};

const AuthButton = ({value, onPress, disabled, loading}: AuthButtonProps) => {
  return (
    <Button disabled={disabled} onPress={onPress}>
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <ButtonText>{value}</ButtonText>
      )}
    </Button>
  );
};

export default AuthButton;
