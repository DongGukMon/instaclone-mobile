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
const USER_ID = 'userId';

export const isLoggedInVar = makeVar(false);

export const userDataVar = makeVar(0);

// export const getUserId = async()=>{
//   const userId = await AsyncStorage.getItem(USER_ID)
//   userDataVar({id:userId})
// }

export const logUserIn = async (token: string, id: number) => {
  await AsyncStorage.multiSet([
    [TOKEN, token],
    [USER_ID, JSON.stringify(id)],
  ]);
  userDataVar(id);
  isLoggedInVar(true);
};

export const setUserData = async () => {
  const userId = await AsyncStorage.getItem(USER_ID);
  if (userId) {
    userDataVar(JSON.parse(userId));
  }
};

export const logUserOut = async () => {
  await AsyncStorage.multiRemove([TOKEN, USER_ID]);
  isLoggedInVar(false);
  userDataVar(0);
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
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          seeFeed: {
            keyArgs: false,
            merge(existing = [], incoming = []) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  link: authLink.concat(httpLink),
  //   connectToDevTools: true,
});
