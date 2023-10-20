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
				<Flex key={group.id} gap="3" align="center">
					<SideNavigationLink to={`/g/${group.id}`}>
						<span>{getInitials(group.name)}</span>
					</SideNavigationLink>
					<Flex grow="1" justify="between" align="center">
						<Text> {group.name}</Text>
						<GroupMenu />
					</Flex>
				</Flex>
			))}
		</Flex>
	);
};

export default GroupList;
