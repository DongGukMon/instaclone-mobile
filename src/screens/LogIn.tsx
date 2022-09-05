import {Alert} from 'react-native';
import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
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
  const route = useRoute<any>();
  const {register, setValue, setFocus, handleSubmit, watch} = useForm({
    defaultValues: {
      username: route.params?.username,
      password: route.params?.password,
    },
  });

  const loginMutationCompleted = async (data: ILoginResponse) => {
    const {
      login: {ok, token, error},
    } = data;
    if (ok && token) {
      await logUserIn(token);
    } else if (error) {
      Alert.alert(error);
    }
  };

  const [logInMutation, {loading}] = useMutation(LOG_IN_MUTATION, {
    onCompleted: loginMutationCompleted,
    onError: e => console.log(JSON.stringify(e, null, 1)),
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
        value={watch('username')}
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
        value={watch('password')}
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
