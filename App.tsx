import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import LoggedOutNav from './src/navigators/LoggedOutNav';
import {ApolloProvider, useReactiveVar} from '@apollo/client';
import {checkLogIn, client, isLoggedInVar, setUserData} from './src/apollo';
import LoggedInNav from './src/navigators/LoggedInNav';
import Toast from 'react-native-toast-message';
import {StatusBar} from 'react-native';
import {enableFlipperApolloDevtools} from 'react-native-flipper-apollo-devtools';
import {LogBox} from 'react-native';

LogBox.ignoreAllLogs();

enableFlipperApolloDevtools(client as any);

const App = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  setUserData();

  useEffect(() => {
    const loginCheck = async () => {
      await checkLogIn();
    };
    if (!isLoggedIn) {
      loginCheck();
    }
  }, []);

  // const updateRoomQuery = (
  //   _: any,
  //   {
  //     subscriptionData: {
  //       data: {roomUpdates: subData},
  //     },
  //   }: any,
  // ) => {
  //   if (subData?.user?.username !== user?.username) {
  //     client.cache.modify({
  //       id: `Room:${roomId}`,
  //       fields: {
  //         messages: (prev: any) => {
  //           return [...prev, {__ref: `Message:${subData?.id}`}];
  //         },
  //         unreadTotal: (prev: number) => {
  //           return prev + 1;
  //         },
  //       },
  //     });
  //   }
  // };

  return (
    <>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <StatusBar barStyle={'light-content'} />
          {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
        </NavigationContainer>
      </ApolloProvider>
      <Toast />
    </>
  );
};

export default App;
