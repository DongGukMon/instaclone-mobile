/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import LoggedOutNav from './src/navigators/LoggedOutNav';

const App = () => {
  return (
    <NavigationContainer>
      <LoggedOutNav />
    </NavigationContainer>
  );
};

export default App;
