import {
	DrawerContentComponentProps,
	DrawerNavigationOptions,
	DrawerScreenProps,
	createDrawerNavigator
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import React, { ReactElement, cloneElement, memo, useCallback } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

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

type RootDrawerParamList = {
	InnerScreen: undefined;
	Group1: undefined;
	Group2: undefined;
};

interface RootNavigatorProps {
	children: [ReactElement, ReactElement, ReactElement];
}

const RootDrawer = createDrawerNavigator<RootDrawerParamList>();
const InnerDrawer = createDrawerNavigator();

const RootNavigator = ({ children }: RootNavigatorProps) => {
	const [left, center, right] = children;

	const LeftScreen = useCallback(
		(props: DrawerContentComponentProps) => cloneElement(left, { ...props }),
		[left]
	);

	const RightScreen = useCallback(
		(props: DrawerContentComponentProps) => cloneElement(right, { ...props }),
		[right]
	);

	return (
		<NavigationContainer>
			<RootDrawer.Navigator
				id="RootDrawer"
				screenOptions={{
					...screenOptions,
					drawerPosition: 'left'
				}}
				drawerContent={LeftScreen}
			>
				<RootDrawer.Screen
					name="InnerScreen"
					options={{
						drawerItemStyle: { display: 'none' },
						headerShown: false
					}}
				>
					{(props) => (
						<InnerDrawer.Navigator
							id="InnerDrawer"
							drawerContent={RightScreen}
							screenOptions={{
								...screenOptions,
								drawerPosition: 'right'
							}}
						>
							<InnerDrawer.Screen
								name="Home"
								options={{
									headerShown: true,
									header: () => (
										<View>
											<Text>Hello</Text>
										</View>
									)
								}}
							>
								{() => cloneElement(center, props)}
							</InnerDrawer.Screen>
						</InnerDrawer.Navigator>
					)}
				</RootDrawer.Screen>

				<RootDrawer.Screen name="Group1">
					{(props) => (
						<InnerDrawer.Navigator
							id="InnerDrawer"
							drawerContent={RightScreen}
							screenOptions={{
								...screenOptions,
								drawerPosition: 'right'
							}}
						>
							<InnerDrawer.Screen name="Home">
								{() => cloneElement(center, props)}
							</InnerDrawer.Screen>
						</InnerDrawer.Navigator>
					)}
				</RootDrawer.Screen>

				<RootDrawer.Screen name="Group2">
					{(props) => (
						<InnerDrawer.Navigator
							id="InnerDrawer"
							drawerContent={RightScreen}
							screenOptions={{
								...screenOptions,
								drawerPosition: 'right'
							}}
						>
							<InnerDrawer.Screen name="Home">
								{() => cloneElement(center, props)}
							</InnerDrawer.Screen>
						</InnerDrawer.Navigator>
					)}
				</RootDrawer.Screen>
			</RootDrawer.Navigator>
		</NavigationContainer>
	);
};

export default memo(RootNavigator);
