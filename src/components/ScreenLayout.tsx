import React from 'react';
import {View, ActivityIndicator} from 'react-native';

interface ScreenLayoutProps {
  children: React.ReactNode;
  loading?: boolean;
}

export default function ScreenLayout({
  children,
  loading = false,
}: ScreenLayoutProps) {
  return (
    <View
      style={{
        backgroundColor: 'black',
        flex: 1,
      }}>
      {loading ? (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator color="white" />
        </View>
      ) : (
        children
      )}
    </View>
  );
}
