import { Provider, store } from '@reckon/core';
import { Suspense } from 'react';
import { StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RootNavigator from './navigation';

export const Application = () => {
	return (
		<Suspense>
			<Provider store={store}>
				<SafeAreaProvider style={{ flex: 1, backgroundColor: '#f2f6fc' }}>
					<GestureHandlerRootView style={{ flex: 1 }}>
						<StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
						<RootNavigator />
					</GestureHandlerRootView>
				</SafeAreaProvider>
			</Provider>
		</Suspense>
	);
};
