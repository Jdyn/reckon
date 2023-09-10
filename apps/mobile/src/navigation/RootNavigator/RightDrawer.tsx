import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { StyleSheet, Text, View } from 'react-native';

const RightDrawer = (_props: DrawerContentComponentProps) => {
	return (
		<View style={styles.root}>
			<Text>Right Drawer</Text>
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

export default RightDrawer;
