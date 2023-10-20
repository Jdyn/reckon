import { Flex, ScrollArea, Text } from '@radix-ui/themes';
import { useGetGroupsQuery } from '@reckon/core';
import { SideNavigationLink } from '~/components/SideMenu';

import GroupMenu from './GroupMenu';

function getInitials(input: string): string {
	return input
		.split(' ')
		.map((word) => (word[0] as string).toUpperCase())
		.slice(0, 2)
		.join('');
}

const GroupList = () => {
	const { data: groups } = useGetGroupsQuery();

	return (
		<Flex direction="column" gap="3">
			{(groups || []).map((group) => (
				<SideNavigationLink key={group.id} to={`/g/${group.id}`}>
					<Text>{getInitials(group.name)}</Text>
					<Flex grow="1" gap="3" justify="between" align="center">
						<Text weight="bold"> {group.name}</Text>
						<GroupMenu />
					</Flex>
				</SideNavigationLink>
			))}
		</Flex>
	);
};

export default GroupList;
