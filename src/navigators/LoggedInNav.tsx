import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Feed from '../screens/Feed';
import React from 'react';
import Search from '../screens/Search';
import Notifiactions from '../screens/Notifications';
import Profile from '../screens/Profile';
import {View} from 'react-native';
import TabIcon from '../components/nav/TabIcon';

const Tab = createBottomTabNavigator();

export default function LoggedInNav() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: 'white',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'black',
          // borderTopColor: 'rgba(255,255,255,0.3',
          borderTopColor: 'red',
        },
      }}>
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarIcon: ({focused, color}) => {
            return (
              <TabIcon
                iconName="home-outline"
                focused={focused}
                color={color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({focused, color}) => {
            return (
              <TabIcon
                iconName="search-outline"
                focused={focused}
                color={color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Camera"
        component={View}
        options={{
          tabBarIcon: ({focused, color}) => {
            return (
              <TabIcon
                iconName="camera-outline"
                focused={focused}
                color={color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifiactions}
        options={{
          tabBarIcon: ({focused, color}) => {
            return (
              <TabIcon
                iconName="heart-outline"
                focused={focused}
                color={color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused, color}) => {
            return (
              <TabIcon
                iconName="person-outline"
                focused={focused}
                color={color}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}
