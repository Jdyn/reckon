import { createDrawerNavigator, useDrawerProgress } from '@react-navigation/drawer';
import { useRoute } from '@react-navigation/native';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';

import DrawerContent from './RootNavigator/LeftDrawer';

function HomeScreen({ navigation }: { navigation: any }) {
	const drawerProgress = useDrawerProgress();
	const route = useRoute();

	const viewStyles = useAnimatedStyle(() => {
		return {
			backgroundColor: interpolateColor(
				drawerProgress.value,
				[0, 1],
				route.name === 'Home2'
					? ['rgba(255, 255, 255, 1)', '#f2f6fc']
					: ['#f2f6fc', 'rgba(255, 255, 255, 1)']
			)
		};
	});

	return (
		<Animated.View
			style={[
				{
					flex: 1
				},
				viewStyles
			]}
		>
			<Animated.View
				style={[
					{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: 'white',
						borderRadius: 8,
						margin: 10,
						marginLeft: 0,
						marginTop: Platform.OS === 'android' ? 35 : 10
					}
				]}
			>
				<Button
					onPress={() => navigation.getParent('LeftDrawer').openDrawer()}
					title="Open left drawer"
				/>
				<Text>HELLO WORLD</Text>
				<Button
					onPress={() => navigation.getParent('RightDrawer').openDrawer()}
					title="Open right drawer"
				/>
			</Animated.View>
		</Animated.View>
	);
}

function RightDrawerContent() {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>This is the right drawer</Text>
		</View>
	);
}

const LeftDrawer = createDrawerNavigator();

function LeftDrawerScreen() {
	return (
		<LeftDrawer.Navigator
			id="LeftDrawer"
			drawerContent={(props) => <DrawerContent {...(props as any)} />}
			screenOptions={{
				drawerPosition: 'left',
				drawerStyle: styles.drawerStyles,
				drawerType: 'slide',
				overlayColor: 'transparent',
				swipeEdgeWidth: Platform.OS === 'android' ? 180 : undefined,
				headerShown: false
			}}
		>
			<LeftDrawer.Screen name="Home2" component={HomeScreen} />
			<LeftDrawer.Screen name="Home3" component={HomeScreen} />
		</LeftDrawer.Navigator>
	);
}

const RightDrawer = createDrawerNavigator();

function RightDrawerScreen() {
	return (
		<RightDrawer.Navigator
			id="RightDrawer"
			drawerContent={(props) => <RightDrawerContent {...(props as any)} />}
			screenOptions={{
				drawerPosition: 'right',
				drawerStyle: styles.drawerStyles,
				drawerType: 'slide',
				overlayColor: 'transparent',
				swipeEdgeWidth: Platform.OS === 'android' ? 180 : undefined,
				headerShown: false
			}}
		>
			<RightDrawer.Screen name="HomeDrawer" component={LeftDrawerScreen} />
		</RightDrawer.Navigator>
	);
}

const styles = StyleSheet.create({
	drawerStyles: {
		flex: 1,
		width: 375,
		backgroundColor: '#f2f6fc',
		flexDirection: 'column'
	},
	sceneStyles: {
		backgroundColor: 'orange'
	}
});

export default RightDrawerScreen;
