import React from 'react';
import {Text, View} from 'react-native';
import ScreenLayout from '../components/ScreenLayout';

export default function Likes() {
  return (
    <ScreenLayout>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'white'}}>Likes</Text>
      </View>
    </ScreenLayout>
  );
}