import RootNavigator from './navigation';
import {Suspense} from 'react';
import {StatusBar} from 'react-native';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

const Application = () => {
	return (
		<Suspense>
			<SafeAreaProvider style={{flex: 1, backgroundColor: '#f2f6fc'}}>
				<GestureHandlerRootView style={{flex: 1}}>
					<SafeAreaView style={{flex: 1}}>
						<StatusBar
							translucent
							backgroundColor="transparent"
							barStyle="dark-content"
						/>
						<RootNavigator />
					</SafeAreaView>
				</GestureHandlerRootView>
			</SafeAreaProvider>
		</Suspense>
	);
};

export default Application;
