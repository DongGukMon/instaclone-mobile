import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import {colors} from '../colors';
import routes from '../routes';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: black;
  padding: 0px 40px;
`;

const Logo = styled.Image`
  max-width: 50%;
  max-height: 100px;
`;

const CreateAccount = styled.TouchableOpacity`
  background-color: ${colors.blue};
  padding: 10px;
  border-radius: 5px;
  font-weight: 600;
  width: 100%;
`;
const CreateAcountText = styled.Text`
  color: white;
  font-weight: 600;
  text-align: center;
`;

const LoginLink = styled.Text`
  color: ${colors.blue};
  font-weight: 500;
  margin-top: 20px;
`;

const Welcome = () => {
  const navigation = useNavigation();

  const navigatePage = (route: string) => {
    navigation.navigate(route as never);
  };

  return (
    <Container>
      <Logo resizeMode="contain" source={require('../assets/logo.png')} />
      <CreateAccount onPress={() => navigatePage(routes.CreateAccount)}>
        <CreateAcountText>Create Account</CreateAcountText>
      </CreateAccount>
      <TouchableOpacity onPress={() => navigatePage(routes.LogIn)}>
        <LoginLink>Log in</LoginLink>
      </TouchableOpacity>
    </Container>
  );
};

export default Welcome;
