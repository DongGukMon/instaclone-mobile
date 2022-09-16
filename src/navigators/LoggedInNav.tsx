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
import CameraScreen from '../screens/CameraScreen';
import Album from '../screens/Album';
import HeaderRight from '../components/camera/HeaderRight';

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
        name="CameraScreen"
        component={CameraScreen}
        options={{
          title: '',
          headerBackTitleVisible: false,
          headerTintColor: 'white',
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="Album"
        component={Album}
        options={{
          title: '',
          headerBackTitleVisible: false,
          headerTintColor: 'white',
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="Upload"
        component={Upload}
        options={{
          presentation: 'card',
          title: 'Upload',
          headerBackTitleVisible: false,
          headerTintColor: 'white',
          headerStyle: {backgroundColor: 'black'},
        }}
      />
    </Stack.Navigator>
  );
}
