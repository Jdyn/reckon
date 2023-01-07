import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RootNavigator from './navigation';

const Application = () => {
  return (
    <SafeAreaProvider style={{flex: 1}}>
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default Application;
