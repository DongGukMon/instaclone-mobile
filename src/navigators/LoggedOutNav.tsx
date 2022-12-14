import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CreateAccount from '../screens/CreateAccount';
import Welcome from '../screens/Welcome';
import LogIn from '../screens/LogIn';

const Stack = createStackNavigator();

const LoggedOutNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitle: '',
        headerTintColor: 'white',
        headerTransparent: true,
      }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
    </Stack.Navigator>
  );
};

export default LoggedOutNav;
