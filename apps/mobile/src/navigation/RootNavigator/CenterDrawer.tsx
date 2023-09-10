import { DrawerContentComponentProps, useDrawerProgress } from '@react-navigation/drawer';
import { useRoute } from '@react-navigation/native';
import { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

type CenterDrawerProps = {
	children: ReactElement;
} & DrawerContentComponentProps;

const CenterDrawer = ({ children }: CenterDrawerProps) => {
	const drawerProgress = useDrawerProgress();
	const route = useRoute();

	const viewStyles = useAnimatedStyle(() => {
		return {
			backgroundColor: interpolateColor(
				drawerProgress.value,
				[0, 1],
				route.name === 'Home'
					? ['rgba(255, 255, 255, 1)', '#f2f6fc']
					: ['#f2f6fc', 'rgba(255, 255, 255, 1)']
			)
		};
	});

	return (
		<Animated.View style={[{ flex: 1 }, viewStyles]}>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={styles.root}>{children}</View>
			</SafeAreaView>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	root: {
		flex: 1,
		borderRadius: 8,
		backgroundColor: 'white',
		marginTop: 15,
		marginBottom: 15,
		padding: 10
	}
});

export default CenterDrawer;
