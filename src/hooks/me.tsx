import {gql, useReactiveVar, useQuery} from '@apollo/client';
import {useEffect} from 'react';
import {isLoggedInVar, logUserOut, userDataVar} from '../apollo';

const ME_QUERY = gql`
  query me {
    me {
      id
      username
      avatar
      rooms {
        id
      }
    }
  }
`;

const useUser = () => {
  const hasToken = useReactiveVar(isLoggedInVar);
  const userId = useReactiveVar(userDataVar);

  const {data, refetch, loading} = useQuery(ME_QUERY, {
    skip: !hasToken,
  });
  const user = data?.me;

  useEffect(() => {
    if (!hasToken && user === null) {
      console.log('log out');
      logUserOut();
    }
    if (hasToken && !loading && Boolean(userId) && user?.id !== userId) {
      refetch();
      console.log('me refetch!');
    }
  }, [data]);

  return {user};
};
export default useUser;
