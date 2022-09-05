import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';

const TOKEN = 'token';

//   export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));
export const isLoggedInVar = makeVar(false);
//   export const logUserIn = (token) => {
//     localStorage.setItem(TOKEN, token);
//     isLoggedInVar(true);
//   };

//   export const logUserOut = () => {
//     localStorage.removeItem(TOKEN);
//     window.location.reload();
//   };

export const darkModeVar = makeVar(false);

const httpLink = createHttpLink({
  uri: 'https://shy-yaks-jump-221-147-21-15.loca.lt//graphql',
});

const authLink = setContext((_, {headers}) => {
  // const token = localStorage.getItem(TOKEN);

  return {
    headers: {
      ...headers,
      // authorization: token ? token : "",
      authorization: '',
    },
  };
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
  //   connectToDevTools: true,
});
