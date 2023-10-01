import { Flex, Heading, Text, TextField } from '@radix-ui/themes';

const NewGroup = () => {
	return (
		<Flex py="2" direction="column">
			<Heading>New Group</Heading>
			<label>
				<Text>Group Name</Text>
				<TextField.Input />
			</label>
		</Flex>
	);
};

export default NewGroup;
