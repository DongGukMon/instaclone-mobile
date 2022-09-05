import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

interface TabIconProps {
  iconName: string;
  focused: boolean;
  color: string;
}

const TabIcon = ({iconName, focused, color}: TabIconProps) => {
  return (
    <Icon
      name={focused ? iconName : `${iconName}-outline`}
      color={color}
      size={focused ? 24 : 20}
    />
  );
};

export default TabIcon;
