/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, ScrollView, StatusBar} from 'react-native';
import {Provider, store} from '@reckon/core';
import Main from './src/main';

function App(): JSX.Element {
	return (
		<Provider store={store}>
			<SafeAreaView>
				<StatusBar />
				<ScrollView>
					<Main />
				</ScrollView>
			</SafeAreaView>
		</Provider>
	);
}

export default App;
