import { DrawerContentComponentProps, DrawerItemList } from '@react-navigation/drawer';
import { useGetGroupsQuery } from '@reckon/core';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LeftDrawer = (props: DrawerContentComponentProps) => {
	const { data } = useGetGroupsQuery();
	// console.log(data)
	return (
		<SafeAreaView style={styles.root}>
			<View style={styles.group}>
				<DrawerItemList {...props} />
			</View>
			<View style={styles.menu}>
				<Text>menu</Text>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	root: {
		flex: 1,
		gap: 10,
		margin: 10,
		marginTop: 15,
		marginBottom: 15,
		flexDirection: 'row'
	},
	group: {
		width: 75,
		flexDirection: 'column',
		flex: 1,
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
