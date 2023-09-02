import {
	DrawerContentComponentProps,
	DrawerNavigationOptions,
	DrawerScreenProps,
	createDrawerNavigator
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import React, { ReactElement, cloneElement } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

const RootDrawer = createDrawerNavigator();
const InnerDrawer = createDrawerNavigator();

const styles = StyleSheet.create({
	root: {
		flex: 1,
		width: 375,
		backgroundColor: '#f2f6fc',
		flexDirection: 'column'
	}
});

const screenOptions: DrawerNavigationOptions = {
	drawerStyle: styles.root,
	drawerType: 'slide',
	overlayColor: 'transparent',
	swipeEdgeWidth: Platform.OS === 'android' ? 180 : undefined,
	headerShown: false
};

const build = (drawer: ReactElement, drawerProps: DrawerContentComponentProps) =>
	React.cloneElement(drawer, { ...drawerProps });

interface RootNavigatorProps {
	children: [any, any, any];
}

const RootNavigator = ({ children }: RootNavigatorProps) => {
	const [left, center, right] = children;
	return (
		<NavigationContainer>
			<RootDrawer.Navigator
				id="RootDrawer"
				screenOptions={{ ...screenOptions, drawerPosition: 'right' }}
				drawerContent={(props) => build(right, props)}
			>
				<RootDrawer.Screen name="HomeDrawer">
					{() => (
						<InnerDrawer.Navigator
							id="HomeDrawer"
							drawerContent={(props) => build(left, props)}
							screenOptions={{
								...screenOptions,
								drawerPosition: 'left'
							}}
						>
							<InnerDrawer.Screen name="Home">
								{(props) => cloneElement(center, props)}
							</InnerDrawer.Screen>
						</InnerDrawer.Navigator>
					)}
				</RootDrawer.Screen>
			</RootDrawer.Navigator>
		</NavigationContainer>
	);
};

export default RootNavigator;
