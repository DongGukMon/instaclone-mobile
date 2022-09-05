import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text} from 'react-native';

export default function Profile() {
  const {navigate} = useNavigation();
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'black',
      }}>
      <Text style={{color: 'white'}}>Profile</Text>
    </View>
  );
}
