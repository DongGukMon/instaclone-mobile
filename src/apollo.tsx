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

export const isLoggedInVar = makeVar(false);

export const logUserIn = async (token: string) => {
  await AsyncStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
};

export const logUserOut = async () => {
  await AsyncStorage.removeItem(TOKEN);
  isLoggedInVar(false);
};

export const checkLogIn = async () => {
  const token = await AsyncStorage.getItem(TOKEN);
  if (token) {
    isLoggedInVar(true);
  }
};

// export const darkModeVar = makeVar(false);

const httpLink = createHttpLink({
  uri:
    Platform.OS == 'ios'
      ? 'http://localhost:4000/graphql'
      : 'http://205d-121-131-99-99.ngrok.io/graphql',
});

const authLink = setContext(async (_, {headers}) => {
  const token = await AsyncStorage.getItem(TOKEN);

  return {
    headers: {
      ...headers,
      authorization: token ? token : '',
    },
  };
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
  //   connectToDevTools: true,
});
