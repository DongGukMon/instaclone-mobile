import {gql, useReactiveVar, useQuery} from '@apollo/client';
import {useEffect} from 'react';
import {isLoggedInVar, logUserOut, userDataVar} from '../apollo';

const ME_QUERY = gql`
  query me {
    me {
      id
      username
      avatar
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
    if (user === null) {
      logUserOut();
    }
    if (!loading && Boolean(userId) && user?.id !== userId) {
      refetch();
      console.log('me refetch!');
    }
  }, [data]);

  return {user};
};
export default useUser;
