import { Heading, TextField, Text } from '@radix-ui/themes';

const NewGroup = () => {
	return (
		<div>
			<Heading>New Group</Heading>
			<label>
				<Text>Total</Text>
				<TextField.Root>
					<TextField.Input />
				</TextField.Root>
			</label>
		</div>
	);
};

export default NewGroup;
