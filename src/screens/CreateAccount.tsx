import React, {useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import AuthLayout from '../components/auth/AuthLayout';
import {TextInput} from '../components/auth/AuthShared';
import AuthButton from '../components/auth/AuthButton';
import {useForm} from 'react-hook-form';
import {colors} from '../colors';
import {gql, useMutation} from '@apollo/client';
import {Alert} from 'react-native';
import {showSuccessToast} from '../utils/Toast';

interface ICreateAccountResponse {
  createAccount: {
    ok: boolean;
    error: string;
  };
}

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

const CreateAccount = () => {
  const navigation = useNavigation();
  const {register, setValue, handleSubmit, setFocus, reset} = useForm({});

  const createAccountCompleted = (data: ICreateAccountResponse) => {
    reset();
    const {
      createAccount: {ok, error},
    } = data;
    if (ok) {
      navigation.navigate('LogIn' as never);
      showSuccessToast('Sign up completed');
    } else {
      Alert.alert(error);
    }
  };

  const [createAccountMutation, {loading}] = useMutation(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted: createAccountCompleted,
      onError: error => console.log(JSON.stringify(error, null, 1)),
    },
  );

  const onVaild = (data: any) => {
    createAccountMutation({
      variables: {
        ...data,
      },
    });
  };

  return (
    <AuthLayout>
      <TextInput
        {...register('firstName', {required: true})}
        placeholder="First Name"
        placeholderTextColor={colors.placeholder}
        style={{color: 'white'}}
        returnKeyType="next"
        onSubmitEditing={() => setFocus('lastName')}
        onChangeText={(text: string) => setValue('firstName', text)}
        blurOnSubmit={false}
      />
      <TextInput
        {...register('lastName')}
        placeholder="Last Name"
        placeholderTextColor={colors.placeholder}
        style={{color: 'white'}}
        returnKeyType="next"
        onSubmitEditing={() => setFocus('username')}
        onChangeText={(text: string) => setValue('lastName', text)}
        blurOnSubmit={false}
      />
      <TextInput
        {...register('username', {required: true})}
        placeholder="Username"
        placeholderTextColor={colors.placeholder}
        style={{color: 'white'}}
        returnKeyType="next"
        autoCapitalize="none"
        onSubmitEditing={() => setFocus('email')}
        onChangeText={(text: string) => setValue('username', text)}
        blurOnSubmit={false}
      />
      <TextInput
        {...register('email', {required: true})}
        placeholder="Email"
        placeholderTextColor={colors.placeholder}
        style={{color: 'white'}}
        returnKeyType="next"
        autoCapitalize="none"
        keyboardType="email-address"
        onSubmitEditing={() => setFocus('password')}
        onChangeText={(text: string) => setValue('email', text)}
        blurOnSubmit={false}
      />
      <TextInput
        {...register('password', {required: true})}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor={colors.placeholder}
        style={{color: 'white'}}
        returnKeyType="done"
        onSumitEditing={handleSubmit(onVaild)}
        onChangeText={(text: string) => setValue('password', text)}
      />
      <AuthButton
        value="Create Account"
        disabled={false}
        onPress={handleSubmit(onVaild)}
        loading={loading}
      />
    </AuthLayout>
  );
};

export default CreateAccount;
