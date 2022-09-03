import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const LogIn = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Here is LogIn</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateAccount' as never)}>
        <View>
          <Text>Go to Create Account</Text>
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

export default LogIn;
