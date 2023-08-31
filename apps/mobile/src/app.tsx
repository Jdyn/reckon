import * as React from 'react';
import { SafeAreaView, View, Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from './components/home';
import { ROUTES } from './constants/routes';

const Stack = createNativeStackNavigator();

export const App = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f3e8' }}>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen
                            options={{ headerShown: false }}
                            name="Home"
                            component={() => {
															return (
																<View>
																	<Text>Hello</Text>
																</View>
															);
														}}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
        </SafeAreaView>
    );
};
