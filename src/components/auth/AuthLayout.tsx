import React from 'react';
import {Keyboard, Platform, TouchableWithoutFeedback} from 'react-native';
import styled from 'styled-components/native';

const Container = styled.KeyboardAvoidingView`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: black;
  padding: 0px 20px;
  width: 100%;
`;

const Logo = styled.Image`
  max-width: 50%;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  max-height: 100px;
`;

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({children}: AuthLayoutProps) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      style={{flex: 1}}
      disabled={Platform.OS === 'web'}>
      <Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Logo resizeMode="contain" source={require('../../assets/logo.png')} />
        {children}
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default AuthLayout;
