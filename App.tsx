/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import LoggedOutNav from './src/navigators/LoggedOutNav';
import {ApolloProvider, useReactiveVar} from '@apollo/client';
import {client} from './src/apollo';
import LoggedInNav from './src/navigators/LoggedInNav';
import {isLoggedInVar} from './src/apollo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const App = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  useEffect(() => {
    console.log('useEffect 실행되고 있는가??');
    AsyncStorage.getItem('token').then(i => {
      if (i) {
        isLoggedInVar(true);
      }
    });
  }, []);

  return (
    <>
      <ApolloProvider client={client}>
        <NavigationContainer>
          {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
        </NavigationContainer>
      </ApolloProvider>
      <Toast />
    </>
  );
};

export default App;
