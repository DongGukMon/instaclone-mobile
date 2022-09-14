import React from 'react';
import {TouchableWithoutFeedback, Keyboard, Platform} from 'react-native';

export default function DismissKeyboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback
      onPress={dismissKeyboard}
      disabled={Platform.OS === 'web'}
      style={{flex: 1, backgroundColor: 'black'}}>
      {children}
    </TouchableWithoutFeedback>
  );
}
