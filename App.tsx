import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import LoggedOutNav from './src/navigators/LoggedOutNav';
import {ApolloProvider, useReactiveVar} from '@apollo/client';
import {checkLogIn, client} from './src/apollo';
import LoggedInNav from './src/navigators/LoggedInNav';
import {isLoggedInVar} from './src/apollo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const App = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  useEffect(() => {
    const loginCheck = async () => {
      await checkLogIn();
    };
    if (!isLoggedIn) {
      loginCheck();
    }
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
