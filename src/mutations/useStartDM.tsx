import {gql, useMutation} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload: String!, $roomId: Int, $userId: Int) {
    sendMessage(payload: $payload, roomId: $roomId, userId: $userId) {
      ok
      error
      id
      roomId
    }
  }
`;

interface useStartDMProps {
  author: {
    id: number;
    username: string;
    avatar: string | null;
    __typename?: string;
  };
  talkingTo: {
    id: number;
    username: string;
    avatar: string | null;
    __typename?: string;
  };
}

const useStartDM = ({author, talkingTo}: useStartDMProps) => {
  const {navigate} = useNavigation();
  const startDMUpdate = (cache: any, result: any) => {
    const {ok, error, id, roomId} = result?.data?.sendMessage;
    const payload = 'DM이 시작되었어요!';

    if (ok) {
      const sendingMessage = cache.writeFragment({
        id: `Message:${id}`,
        fragment: gql`
          fragment outGoingMessage on Message {
            id
            payload
            read
            user {
              avatar
              username
            }
            createdAt
          }
        `,
        data: {
          createdAt: Date.now().toString(),
          __typename: 'Message',
          id,
          payload,
          read: false,
          user: author,
        },
      });

      const newRoom = cache.writeFragment({
        id: `Room:${roomId}`,
        fragment: gql`
          fragment newRoom on Room {
            id
            users {
              username
              avatar
              id
            }
            messages {
              id
              payload
              read
              user {
                avatar
                username
              }
              createdAt
            }
            unreadTotal
            createdAt
          }
        `,
        data: {
          createdAt: Date.now().toString(),
          __typename: 'Room',
          id: roomId,
          unreadTotal: 0,
          users: [
            author,
            {
              id: talkingTo?.id,
              username: talkingTo?.username,
              avatar: talkingTo?.avatar,
              __typename: talkingTo?.__typename,
            },
          ],
          messages: [
            {
              createdAt: Date.now().toString(),
              __typename: 'Message',
              id,
              payload,
              read: false,
              user: author,
            },
          ],
        },
      });

      cache.modify({
        fields: {
          seeRooms: (prev: any) => {
            return [newRoom, ...prev];
          },
          [`seeRoom({"id":${roomId}})`]: newRoom,
        },
      });

      navigate(
        'Room' as never,
        {roomId, talkingTo: talkingTo.username} as never,
      );
    } else if (error) {
      console.log(error);
    }
  };

  const [startDMMutation, {loading}] = useMutation(SEND_MESSAGE_MUTATION, {
    update: startDMUpdate,
    variables: {
      payload: 'DM이 시작되었어요!',
      userId: talkingTo?.id,
    },
  });

  return {startDMMutation, loading};
};

export default useStartDM;
