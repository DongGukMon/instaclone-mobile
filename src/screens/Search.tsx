import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {logUserOut} from '../apollo';

export default function Search() {
  const {navigate} = useNavigation();
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'black',
      }}>
      {/* <TouchableOpacity onPress={() => navigate('Profile' as never)}> */}
      <TouchableOpacity onPress={() => logUserOut()}>
        <Text style={{color: 'white'}}>Search</Text>
      </TouchableOpacity>
    </View>
  );
}
