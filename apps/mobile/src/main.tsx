import { useGetAccountQuery } from "@reckon/core";
import { View, Text } from "react-native";

const Main = () => {

	const { data, error } =useGetAccountQuery();
	console.log(error);

	return (
		<View>
			<Text>Hello</Text>
		</View>
	 );
}

export default Main;
