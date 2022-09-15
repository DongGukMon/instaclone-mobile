import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Feed from '../screens/Feed';
import Notifiactions from '../screens/Notifications';
import Profile from '../screens/Profile';
import Search from '../screens/Search';
import {Image, Text, View} from 'react-native';
import Comments from '../screens/Comments';
import Likes from '../screens/Likes';
import Detail from '../screens/Detail';

const Stack = createStackNavigator();

export default function SharedStackNav({screenName}: {screenName: string}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: 'white',
        headerBackTitleVisible: false,
        headerMode: 'screen',
        headerStyle: {
          backgroundColor: 'black',
          shadowColor: 'rgba(255,255,255,0.3)',
        },
      }}>
      {screenName === 'Feed' ? (
        <Stack.Screen
          name={'Feed'}
          component={Feed}
          options={{
            headerTitle: () => (
              <Image
                resizeMode="contain"
                style={{maxHeight: 30, alignSelf: 'center'}}
                source={require('../assets/logo.png')}
              />
            ),
          }}
        />
      ) : null}
      {screenName === 'Search' ? (
        <Stack.Screen name={'Search'} component={Search} />
      ) : null}
      {screenName === 'Notifications' ? (
        <Stack.Screen name={'Notifiactions'} component={Notifiactions} />
      ) : null}
      <Stack.Screen name={'Profile'} component={Profile} />
      <Stack.Screen name={'Comments'} component={Comments} />
      <Stack.Screen name={'Likes'} component={Likes} />
      <Stack.Screen
        name={'Detail'}
        component={Detail}
        options={{headerTitle: 'Photo'}}
      />
    </Stack.Navigator>
  );
}
