import React, {useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import AuthLayout from '../components/auth/AuthLayout';
import {TextInput} from '../components/auth/AuthShared';
import AuthButton from '../components/auth/AuthButton';
import {useForm} from 'react-hook-form';
import {colors} from '../colors';
import {gql, useMutation} from '@apollo/client';

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $fistName: string!
    $lastName: string
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
  const {register, setValue, handleSubmit, setFocus} = useForm({});

  const createAccountUpdate = (cache: any, data: object) => {
    console.log(cache);
    console.log(data);
  };

  const [createAccountMutation] = useMutation(CREATE_ACCOUNT_MUTATION, {
    update: createAccountUpdate,
  });

  const onVaild = (data: any) => {
    const {firstName, lastName, username, email, password} = data;

    createAccountMutation({
      variables: {
        firstName,
        lastName,
        username,
        email,
        password,
      },
    });
  };

  return (
    <AuthLayout>
      <TextInput
        {...register('firstName')}
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
        {...register('username')}
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
        {...register('email')}
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
        {...register('password')}
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
        // onPress={() => setFocus('firstName')}
      />
    </AuthLayout>
  );
};

export default CreateAccount;
