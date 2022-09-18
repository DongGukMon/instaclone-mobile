import {ApolloCache, gql, useMutation} from '@apollo/client';
import React from 'react';

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload: String!, $roomId: Int, $userId: Int) {
    sendMessage(payload: $payload, roomId: $roomId, userId: $userId) {
      ok
      error
      id
    }
  }
`;

interface useSendMessageProps {
  getValues: Function;
  author: {
    username: string;
    avatar: string | null;
    __typename?: string;
  };
  roomId: number;
  setValue: Function;
}

const useSendMessage = ({
  getValues,
  author,
  roomId,
  setValue,
}: useSendMessageProps) => {
  const sendMessageUpdate = (cache: any, result: any) => {
    const {ok, error, id} = result?.data?.sendMessage;
    const payload = getValues('message');
    setValue('message', '');

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

      cache.modify({
        id: `Room:${roomId}`,
        fields: {
          messages: (prev: any) => {
            return [...prev, sendingMessage];
          },
        },
      });
    } else if (error) {
      console.log(error);
    }
  };

  const [sendMessageMutation, {loading}] = useMutation(SEND_MESSAGE_MUTATION, {
    update: sendMessageUpdate,
  });

  return {sendMessageMutation, loading};
};

export default useSendMessage;
