import styled from 'styled-components/native';
import {colors} from '../colors';

export const FollowText = styled.Text`
  color: ${(props: any) => (props.isFollowing ? 'black' : 'white')};
  font-weight: 600;
`;

export const FollowBtn = styled.TouchableOpacity`
  background-color: ${(props: any) =>
    props.isFollowing ? colors.lightGray : colors.blue};
  width: 80px;
  height: 100%;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;
