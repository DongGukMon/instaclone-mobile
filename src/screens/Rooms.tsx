import {gql, useQuery} from '@apollo/client';
import React from 'react';
import {FlatList, useWindowDimensions, View} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../colors';
import RoomItem from '../components/Message/RoomItem';
import ScreenLayout from '../components/ScreenLayout';
import useUser from '../hooks/me';

const SEE_ROOMS_QUERY = gql`
  query seeRooms {
    seeRooms {
      id
      users {
        username
        avatar
        id
      }
      unreadTotal
    }
  }
`;

const Separator = styled.View`
  width: 95%;
  background-color: ${colors.lightGray};
  height: 0.3px;
  align-self: center;
`;

export default function Rooms() {
  const {height} = useWindowDimensions();
  const {data, loading} = useQuery(SEE_ROOMS_QUERY);
  const {
    user: {username: meName},
  } = useUser();

  const _renderItem = ({item: room}: any) => {
    const notMe = room?.users.find(
      (user: {username: string}) => user.username !== meName,
    );

    return (
      <RoomItem
        avatar={notMe?.avatar}
        username={notMe?.username}
        unreadTotal={room?.unreadTotal}
        id={room?.id}
      />
    );
  };

  return (
    <ScreenLayout>
      <View style={{flex: 1}}>
        <FlatList
          data={data?.seeRooms}
          renderItem={_renderItem}
          keyExtractor={item => item.id + ''}
        />
      </View>
    </ScreenLayout>
  );
}
