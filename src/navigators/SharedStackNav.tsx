import {createStackNavigator} from '@react-navigation/stack';
import React, {useCallback} from 'react';
import Feed from '../screens/Feed';
import Notifiactions from '../screens/Notifications';
import Profile from '../screens/Profile';
import Search from '../screens/Search';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Comments from '../screens/Comments';
import Likes from '../screens/Likes';
import Detail from '../screens/Detail';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {logUserOut} from '../apollo';
import EditProfile from '../screens/EditProfile';

const Stack = createStackNavigator();

export default function SharedStackNav({screenName}: {screenName: string}) {
  const {navigate} = useNavigation();
  const goToMessage = useCallback(() => {
    navigate('Message' as never);
  }, []);

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
                style={{maxHeight: 30, width: 120, alignSelf: 'center'}}
                source={require('../assets/logo.png')}
              />
            ),
            headerRight: () => (
              <TouchableOpacity style={{marginRight: 10}} onPress={goToMessage}>
                <Icon name="send" size={24} color="white" />
              </TouchableOpacity>
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
      <Stack.Screen
        name={'Profile'}
        component={Profile}
        options={{
          headerRight: () => {
            return (
              <TouchableOpacity
                style={{
                  backgroundColor: 'tomato',
                  width: 60,
                  height: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                }}
                onPress={() => logUserOut()}>
                <Text style={{color: 'white', fontWeight: '600'}}>log out</Text>
              </TouchableOpacity>
            );
          },
        }}
      />
      <Stack.Screen name={'EditProfile'} component={EditProfile} />
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
