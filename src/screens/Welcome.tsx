import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import {colors} from '../colors';
import routes from '../routes';
import AuthLayout from '../components/auth/AuthLayout';
import AuthButton from '../components/auth/AuthButton';

const LoginLink = styled.Text`
  color: ${colors.blue};
  font-weight: 500;
  margin-top: 20px;
`;

const Welcome = () => {
  const navigation = useNavigation();

  const navigatePage = (route: string) => navigation.navigate(route as never);

  return (
    <AuthLayout>
      <AuthButton
        value="Create New Account"
        onPress={() => navigatePage(routes.CreateAccount)}
        disabled={false}
      />
      <TouchableOpacity onPress={() => navigatePage(routes.LogIn)}>
        <LoginLink>Log in</LoginLink>
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default Welcome;
