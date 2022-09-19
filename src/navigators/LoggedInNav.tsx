import React, {useEffect} from 'react';
import Upload from '../screens/Upload';
import {createStackNavigator} from '@react-navigation/stack';
import TabsNav from './TabsNav';
import CameraScreen from '../screens/CameraScreen';
import Album from '../screens/Album';
import MessageNav from './MessageNav';
import {MESSAGE_FRAGMENT} from '../fragments';
import {gql, useSubscription} from '@apollo/client';
import {client} from '../apollo';
import useUser from '../hooks/me';

const Stack = createStackNavigator();

const ROOM_UPDATE_SUBSCRIPTION = gql`
  subscription roomUpdates($id: Int!) {
    roomUpdates(id: $id) {
      ...MessageFragment
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export default function LoggedInNav() {
  const {user} = useUser();
  const updateRoomQuery = (result: any) => {
    const message = result?.data?.roomUpdates;
    console.log(message);
    if (message?.user?.username !== user?.username) {
      client.cache.modify({
        id: `Room:${message?.roomId}`,
        fields: {
          messages: (prev: any) => {
            return [...prev, {__ref: `Message:${message?.id}`}];
          },
          unreadTotal: (prev: number) => {
            return prev + 1;
          },
        },
      });
    }
  };

  useEffect(() => {
    let subscriptions: any = [];
    if (user && user.rooms.length !== 0) {
      console.log(user.username);
      subscriptions = user.rooms.map((item: {id: number}) => {
        console.log(item.id);
        return client
          .subscribe({
            query: ROOM_UPDATE_SUBSCRIPTION,
            variables: {id: item.id},
          })
          .subscribe({next: updateRoomQuery});
      });
    }
    return () =>
      subscriptions.map((item: any) => {
        console.log('cleanup: ', user.username);
        item.unsubscribe();
      });
  }, [user]);

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
      <Stack.Screen
        name="Message"
        component={MessageNav}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
