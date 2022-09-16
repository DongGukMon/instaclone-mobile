import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import TabIcon from '../components/nav/TabIcon';
import SharedStackNav from './SharedStackNav';
import useUser from '../hooks/me';
import styled from 'styled-components/native';
import Upload from '../screens/Upload';
import {View} from 'react-native';

const Tab = createBottomTabNavigator();

const Avatar = styled.Image`
  width: ${(props: any) => (props.focused ? '26px' : '22px')};
  height: ${(props: any) => (props.focused ? '26px' : '22px')};
`;

export default function TabsNav() {
  const {user} = useUser();
  const avatar = user?.avatar;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: 'white',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopColor: 'rgba(255,255,255,0.3)',
        },
      }}>
      <Tab.Screen
        name="TabFeed"
        options={{
          tabBarIcon: ({focused, color}) => {
            return <TabIcon iconName="home" focused={focused} color={color} />;
          },
        }}>
        {() => <SharedStackNav screenName="Feed" />}
      </Tab.Screen>
      <Tab.Screen
        name="TabSearch"
        options={{
          tabBarIcon: ({focused, color}) => {
            return (
              <TabIcon iconName="search" focused={focused} color={color} />
            );
          },
        }}>
        {() => <SharedStackNav screenName="Search" />}
      </Tab.Screen>
      <Tab.Screen
        name="TabCamera"
        component={View}
        listeners={({navigation}) => {
          return {
            tabPress: e => {
              e.preventDefault();
              navigation.navigate('CameraScreen');
            },
          };
        }}
        options={{
          tabBarIcon: ({focused, color}) => {
            return (
              <TabIcon iconName="camera" focused={focused} color={color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="TabNotifications"
        options={{
          tabBarIcon: ({focused, color}) => {
            return <TabIcon iconName="heart" focused={focused} color={color} />;
          },
        }}>
        {() => <SharedStackNav screenName="Notifications" />}
      </Tab.Screen>
      <Tab.Screen
        name="TabProfile"
        options={{
          tabBarIcon: ({focused, color}) => {
            return avatar ? (
              <Avatar source={{uri: avatar}} focused={focused} />
            ) : (
              <TabIcon iconName="person" focused={focused} color={color} />
            );
          },
        }}>
        {() => <SharedStackNav screenName="Profile" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
