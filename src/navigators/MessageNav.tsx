import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Room from '../screens/Room';
import Rooms from '../screens/Rooms';
export default function MessageNav() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {backgroundColor: 'black'},
        headerTintColor: 'white',
      }}>
      <Stack.Screen name="Rooms" component={Rooms} />
      <Stack.Screen name="Room" component={Room} />
    </Stack.Navigator>
  );
}
