import RootNavigator from './RootNavigator';
import LeftDrawer from './RootNavigator/LeftDrawer';
import {RootDrawerParamList} from './types';
import {View, Text} from 'react-native';

export default function Navigation() {
	return (
		<RootNavigator>
			<LeftDrawer />
			<View>
				<Text>Center</Text>
			</View>
			<View>
				<Text>Right</Text>
			</View>
		</RootNavigator>
	);
}

// This declaration is used by useNavigation, Link, ref etc.
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace ReactNavigation {
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface RootParamList extends RootDrawerParamList {}
	}
}
