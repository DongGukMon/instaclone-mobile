import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../colors';

function HeaderLeft({onPress}: any) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon name="close" size={30} color={'white'} />
    </TouchableOpacity>
  );
}
export default React.memo(HeaderLeft);
