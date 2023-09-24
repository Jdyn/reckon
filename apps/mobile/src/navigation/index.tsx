import { useAccountSignInMutation, useGetAccountQuery } from '@reckon/core';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

import RootNavigator from './RootNavigator';
import CenterDrawer from './RootNavigator/CenterDrawer';
import LeftDrawer from './RootNavigator/LeftDrawer';
import RightDrawer from './RootNavigator/RightDrawer';
import { RootDrawerParamList } from './types';

export default function Navigation() {
	const [login] = useAccountSignInMutation();
	const { data, error } = useGetAccountQuery();
	console.log(data, error);

	return (
		<RootNavigator>
			<LeftDrawer />
			<CenterDrawer>
				<View>
					<Pressable
						onPress={() => login({ identifier: 'test@test.com', password: 'Password1234' })}
					>
						<Text>Login</Text>
					</Pressable>
				</View>
			</CenterDrawer>
			<RightDrawer />
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
