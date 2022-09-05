import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN = 'token';

//   export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));
// export const isLoggedInVar = makeVar(false);

export const isLoggedInVar = makeVar(false);

export const logUserIn = (token: string) => {
  AsyncStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
};

export const logUserOut = () => {
  AsyncStorage.removeItem(TOKEN);
  isLoggedInVar(false);
};

// export const darkModeVar = makeVar(false);

const httpLink = createHttpLink({
  uri:
    Platform.OS == 'ios'
      ? 'http://localhost:4000/graphql'
      : 'http://61c3-2001-e60-106d-f0e0-a047-735a-bbe-3be7.ngrok.io/graphql',
});

const authLink = setContext(async (_, {headers}) => {
  const token = await AsyncStorage.getItem(TOKEN);

  return {
    headers: {
      ...headers,
      authorization: token ? token : '',
      // authorization: '',
    },
  };
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  // uri: 'http://61c3-2001-e60-106d-f0e0-a047-735a-bbe-3be7.ngrok.io/graphql',
  // uri:
  //   Platform.OS == 'ios'
  //     ? 'http://localhost:4000/graphql'
  //     : 'http://61c3-2001-e60-106d-f0e0-a047-735a-bbe-3be7.ngrok.io/graphql',

  link: authLink.concat(httpLink),
  //   connectToDevTools: true,
});
