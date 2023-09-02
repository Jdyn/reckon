import { DrawerItemList } from '@react-navigation/drawer';
import {View, Text, StyleSheet, Platform} from 'react-native';
import Animated from 'react-native-reanimated';

const LeftDrawer = (props) => {

	return (
		<View style={styles.root}>
			<View style={styles.group}>
				<DrawerItemList {...props} />
			</View>
			<Animated.View style={styles.menu}>
				<Text>menu</Text>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	root: {
		flex: 1,
		gap: 10,
		margin: 10,
		marginTop: 15,
		flexDirection: 'row'
	},
	group: {
		width: 75,
		backgroundColor: 'white',
		padding: 5,
		borderRadius: 8
	},
	menu: {
		flex: 1,
		backgroundColor: 'white',
		padding: 5,
		borderRadius: 8
	}
});

export default LeftDrawer;
