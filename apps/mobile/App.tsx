/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
// import {Provider, store} from '@reckon/core';
import React from 'react';
import { ScrollView, StatusBar, Text, View } from 'react-native';

import Main from './src/main';

function App(): JSX.Element {
	return (
		// <Provider store={store}>
		<Main />
		// </Provider>
	);
}

export default App;
