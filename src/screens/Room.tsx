import {gql, useMutation, useQuery} from '@apollo/client';
import {useRoute} from '@react-navigation/native';
import React, {Fragment, useEffect} from 'react';
import {IsAny, useForm} from 'react-hook-form';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import {client} from '../apollo';
import {colors} from '../colors';
import ScreenLayout from '../components/ScreenLayout';
import {MESSAGE_FRAGMENT} from '../fragments';
import useUser from '../hooks/me';
import useSendMessage from '../mutations/useSendMessage';

const SEE_ROOM_QUERY = gql`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      id
      messages {
        id
        user {
          avatar
          username
        }
        payload
        read
        createdAt
      }
    }
  }
`;

const ROOM_UPDATE_SUBSCRIPTION = gql`
  subscription roomUpdates($id: Int!) {
    roomUpdates(id: $id) {
      ...MessageFragment
    }
  }
  ${MESSAGE_FRAGMENT}
`;

const READ_MESSAGE_MUTATION = gql`
  mutation readMessage($id: Int!) {
    readMessage(id: $id) {
      ok
      error
      id
    }
  }
`;

const Container = styled.View`
  flex: 1;
`;
const MessageContainer = styled.View`
  width: 100%;
  padding: 10px 0px;
  flex-direction: ${({isMe}: {isMe: boolean}) =>
    isMe ? 'row-reverse' : 'row'};
  justify-content: flex-start;
`;
const AvatarContainer = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: ${colors.lightGray};
  margin: 0px 10px;
`;
const Avatar = styled.Image`
  width: 100%;
  height: 100%;
`;
const Column = styled.View`
  align-items: ${({isMe}: {isMe: boolean}) =>
    isMe ? 'flex-end' : 'flex-start'};
  width: 85%;
`;
const Username = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: 600;
  margin-left: 5px;
`;

const Bubble = styled.View`
  padding: 10px;
  background-color: white;
  border-radius: 20px;
  margin-top: 5px;
  max-width: 90%;
`;
const Payload = styled.Text`
  color: black;
  font-size: 14px;
`;

const InputContainer = styled.View`
  width: 95%;
  height: 50px;
  margin-top: 15px;
  margin-bottom: 35px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 15px;
  border-radius: 100px;
  border-width: 2px;
  border-color: rgba(255, 255, 255, 0.5);
  align-self: center;
`;
const MessageInput = styled.TextInput`
  background-color: black;
  width: 85%;
  height: 100%;
  border-radius: 100px;

  color: white;
`;

export default function Room() {
  const {
    params: {roomId, talkingTo},
  } = useRoute<any>();

  const {watch, getValues, setValue} = useForm();
  const {user} = useUser();

  const {sendMessageMutation, loading: sending} = useSendMessage({
    author: user,
    roomId,
    setValue,
    getValues,
  });

  const {data, loading, subscribeToMore} = useQuery(SEE_ROOM_QUERY, {
    variables: {id: roomId},
  });

  const readMessageUpdate = (
    cache: any,
    {
      data: {
        readMessage: {ok, id, error},
      },
    }: any,
  ) => {
    if (ok) {
      cache.modify({
        id: `Message:${id}`,
        fields: {
          read: (prev: any) => true,
        },
      });
      cache.modify({
        id: `Room:${roomId}`,
        fields: {
          unreadTotal: () => 0,
        },
      });
    } else if (error) {
      console.log(error);
    }
  };

  const [readMessageMutation] = useMutation(READ_MESSAGE_MUTATION, {
    update: readMessageUpdate,
  });

  const updateRoomQuery = (
    _: any,
    {
      subscriptionData: {
        data: {roomUpdates: subData},
      },
    }: any,
  ) => {
    if (subData?.user?.username !== user?.username) {
      client.cache.modify({
        id: `Room:${roomId}`,
        fields: {
          messages: (prev: any) => {
            return [...prev, {__ref: `Message:${subData?.id}`}];
          },
          unreadTotal: (prev: number) => {
            return prev + 1;
          },
        },
      });
    }
  };

  useEffect(() => {
    subscribeToMore({
      document: ROOM_UPDATE_SUBSCRIPTION,
      variables: {id: roomId},
      updateQuery: updateRoomQuery,
    });

    client.cache.modify({
      id: `Room:${roomId}`,
      fields: {
        unreadTotal: () => 0,
      },
    });
  }, []);

  useEffect(() => {
    if (!loading && data?.seeRoom?.messages?.length !== 0) {
      data?.seeRoom?.messages?.map(
        (item: {read: boolean; user: {username: string}; id: number}) => {
          const isMe = talkingTo !== item.user.username;
          if (!item.read && !isMe) {
            readMessageMutation({variables: {id: item.id}});
          }
        },
      );
    }
  }, [data]);

  const _renderItem = ({item: message, index}: any) => {
    if (loading) {
      return <View />;
    }

    const {
      user: {avatar, username},
      payload,
      read,
      id,
    } = message;
    const isMe = talkingTo !== username;

    return (
      <MessageContainer isMe={isMe}>
        <AvatarContainer>
          <Avatar source={{uri: avatar}} />
        </AvatarContainer>
        <Column isMe={isMe}>
          <Username>{username}</Username>
          <Bubble>
            <Payload>{payload}</Payload>
          </Bubble>
        </Column>
      </MessageContainer>
    );
  };

  return (
    <ScreenLayout loading={loading}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={70}>
        <Container>
          <FlatList
            data={data?.seeRoom?.messages?.slice().reverse()}
            keyExtractor={item => item.id}
            renderItem={_renderItem}
            inverted
          />
        </Container>
        <InputContainer>
          <TextInput />
          <MessageInput
            placeholder="Text here"
            placeholderTextColor={colors.placeholder}
            onChangeText={(text: string) => setValue('message', text)}
            value={watch('message')}
            returnKeyLabel="send"
            returnKeyType="send"
            onSubmitEditing={() =>
              sendMessageMutation({
                variables: {
                  payload: getValues('message'),
                  roomId,
                },
              })
            }
          />
          <TouchableOpacity
            disabled={!watch('message') || sending}
            onPress={() =>
              sendMessageMutation({
                variables: {
                  payload: getValues('message'),
                  roomId,
                },
              })
            }>
            <Icon
              name="send"
              size={26}
              color={
                watch('message') || sending ? 'white' : 'rgba(255,255,255,0.5)'
              }
            />
          </TouchableOpacity>
        </InputContainer>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}
