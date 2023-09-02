/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import Main from './src/main';
// import {Provider, store} from '@reckon/core';
import React from 'react';
import {SafeAreaView, ScrollView, StatusBar, View, Text} from 'react-native';

function App(): JSX.Element {
	return (
		// <Provider store={store}>
			<Main />
		// </Provider>
	);
}

export default App;
