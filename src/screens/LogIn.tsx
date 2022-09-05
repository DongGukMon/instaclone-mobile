import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import AuthLayout from '../components/auth/AuthLayout';
import {TextInput} from '../components/auth/AuthShared';
import AuthButton from '../components/auth/AuthButton';
import {useForm} from 'react-hook-form';
import {colors} from '../colors';
import {gql, useMutation} from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation login($username: string!, $password: string!) {
    login(username: $username, password: $password) {
      ok
      error
      token
    }
  }
`;

const LogIn = () => {
  const navigation = useNavigation();
  const {register, setValue, setFocus, handleSubmit} = useForm();

  const loginMutationUpdate = (cache: any, data: object) => {
    console.log(cache, data);
  };
  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    update: loginMutationUpdate,
  });

  const onVaild = (data: object) => {
    console.log(data);
  };

  return (
    <AuthLayout>
      <TextInput
        {...register('username')}
        placeholder="Username"
        placeholderTextColor={colors.placeholder}
        style={{color: 'white'}}
        returnKeyType="next"
        autoCapitalize="none"
        onSubmitEditing={() => setFocus('password')}
        onChangeText={(text: string) => setValue('username', text)}
      />
      <TextInput
        {...register('password')}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor={colors.placeholder}
        style={{color: 'white'}}
        returnKeyType="done"
        onSubmitEditing={handleSubmit(onVaild)}
        onChangeText={(text: string) => setValue('password', text)}
      />
      <AuthButton
        value="Log In"
        onPress={handleSubmit(onVaild)}
        disabled={false}
      />
    </AuthLayout>
  );
};

export default LogIn;
