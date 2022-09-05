import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';

interface CommentProps {
  payload: string;
  username: string;
  isCaption?: boolean;
  isMine?: boolean;
}

const FatText = styled.Text`
  color: white;
  font-weight: 600;
`;

const PayloadText = styled.Text`
  margin-left: 5;
  color: white;
`;

function Comment({username, payload, isCaption, isMine}: CommentProps) {
  return (
    <View style={{flexDirection: 'row', marginBottom: isCaption ? 3 : 8}}>
      <FatText style={{color: 'white'}}>{username}</FatText>
      <PayloadText style={{marginLeft: 5, color: 'white'}}>
        {payload}
      </PayloadText>
    </View>
  );
}

export default React.memo(Comment);
