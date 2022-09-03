import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const CreateAccount = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Here is Create Account</Text>
      <TouchableOpacity onPress={() => navigation.navigate('LogIn' as never)}>
        <View>
          <Text>Go to Log In</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Welcome' as never)}>
        <View>
          <Text>Go to Welcome</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CreateAccount;
