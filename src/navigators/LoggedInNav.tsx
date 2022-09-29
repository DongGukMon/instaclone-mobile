import React, {useEffect} from 'react';
import Upload from '../screens/Upload';
import {createStackNavigator} from '@react-navigation/stack';
import TabsNav from './TabsNav';
import CameraScreen from '../screens/CameraScreen';
import Album from '../screens/Album';
import MessageNav from './MessageNav';
import {MESSAGE_FRAGMENT, ROOM_FRAGEMNT} from '../fragments';
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
    } else {
      //보낸 사람이 나 자신일 때. 다른 디바이스에서 메시지를 보낼 때 최신화하는 방법 구현
      const existingMessage = client.readFragment({
        id: `Room:${message?.roomId}`,
        fragment: ROOM_FRAGEMNT,
      });

      const isMine = () => {
        //아직 seeRoom 쿼리가 실행되기 전이라서 cache가 없는 상태. 직접 캐시 컨트롤 안해줘도 어차피 seeRoom쿼리가 실행될때
        //서버에서 messages를 가져오므로 건너뛰어도 됨
        const isNull = existingMessage === null;

        if (isNull) {
          return false;
        }
        //seeRoom 쿼리 결과를 받아왔지만 채팅방 안에 메시지가 하나도 없는 경우.
        //일반적인 경우 이런 케이스는 발생하지 않겠지만 (아직 메시지 삭제를 구현하지 않았으므로)
        //개발 과정에서는 충분히 발생할 수 있는 에러이므로 체크
        const isEmpty = existingMessage?.messages.length === 0;

        if (isEmpty) {
          return true;
        }
        //seeRoom의 messages가 구독 결과로 얻은 메시지를 포함하고 있으면 같은 디바이스에서 메시지를 보낸 것으로 간주하여
        //건너뛴다.
        const messages = existingMessage?.messages;
        const hasMessage = messages[messages.length - 1]?.id === message.id;

        if (hasMessage) {
          return false;
        }
        return true;
      };

      if (isMine()) {
        client.cache.modify({
          id: `Room:${message?.roomId}`,
          fields: {
            messages: (prev: any) => {
              return [...prev, {__ref: `Message:${message?.id}`}];
            },
          },
        });
      }
    }
  };

  useEffect(() => {
    let subscriptions: any = [];
    if (user && user.rooms.length !== 0) {
      subscriptions = user.rooms.map((item: {id: number}) => {
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
