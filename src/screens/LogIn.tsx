import {View, Text, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import AuthLayout from '../components/auth/AuthLayout';
import {TextInput} from '../components/auth/AuthShared';
import AuthButton from '../components/auth/AuthButton';
import {useForm} from 'react-hook-form';
import {colors} from '../colors';
import {gql, useMutation} from '@apollo/client';
import {logUserIn} from '../apollo';

interface ILoginResponse {
  login: {
    ok: string;
    error: string;
    token?: string;
  };
}

const LOG_IN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      error
      token
    }
  }
`;

const LogIn = () => {
  const navigation = useNavigation();
  const {register, setValue, setFocus, handleSubmit, watch} = useForm();

  const loginMutationCompleted = (data: ILoginResponse) => {
    const {
      login: {ok, token, error},
    } = data;
    if (ok && token) {
      logUserIn(token);
    } else if (error) {
      Alert.alert(error);
    }
  };

  const [logInMutation, {loading}] = useMutation(LOG_IN_MUTATION, {
    onCompleted: loginMutationCompleted,
  });

  const onVaild = (data: object) => {
    if (!loading) {
      logInMutation({
        variables: {
          ...data,
        },
      });
    }
  };

  return (
    <AuthLayout>
      <TextInput
        {...register('username', {
          required: true,
        })}
        placeholder="Username"
        placeholderTextColor={colors.placeholder}
        style={{color: 'white'}}
        returnKeyType="next"
        autoCapitalize="none"
        onSubmitEditing={() => setFocus('password')}
        onChangeText={(text: string) => setValue('username', text)}
      />
      <TextInput
        {...register('password', {
          required: true,
        })}
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
        loading={loading}
        disabled={!watch('username') || !watch('password')}
      />
    </AuthLayout>
  );
};

export default LogIn;
