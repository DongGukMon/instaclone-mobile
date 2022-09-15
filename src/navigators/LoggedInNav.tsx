import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Feed from '../screens/Feed';
import React from 'react';
import Search from '../screens/Search';
import Notifiactions from '../screens/Notifications';
import Profile from '../screens/Profile';
import {Image, View} from 'react-native';
import TabIcon from '../components/nav/TabIcon';
import SharedStackNav from './SharedStackNav';
import useUser from '../hooks/me';
import styled from 'styled-components/native';
import Upload from '../screens/Upload';
import {createStackNavigator} from '@react-navigation/stack';
import TabsNav from './TabsNav';

const Stack = createStackNavigator();

export default function LoggedInNav() {
  return (
    <Stack.Navigator screenOptions={{presentation: 'modal'}}>
      <Stack.Screen
        name="TabsNav"
        component={TabsNav}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Upload"
        component={Upload}
        options={{
          title: '',
          headerBackTitleVisible: false,
          headerTintColor: 'white',
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}
