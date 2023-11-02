import { Flex, HoverCard, Tooltip } from '@radix-ui/themes';
import { useGetGroupsQuery } from '@reckon/core';
import { SideNavigationLink } from '~/components/SideMenu';

import GroupContextMenu from './GroupContextMenu';

function getInitials(input: string): string {
	return input
		// .split(' ')
		// .map((word) => (word[0] as string).toUpperCase())
		// .slice(0, 2)
		// .join('');
}

const GroupList = () => {
	const { data: groups } = useGetGroupsQuery();

	return (
		<Flex direction="column" gap="3">
			{(groups || []).map((group) => (
				<Tooltip key={group.id} content={group.name} side="right" delayDuration={300}>
					<div>
						<SideNavigationLink key={group.id} to={`/g/${group.id}/feed`}>
							<GroupContextMenu groupId={group.id} key={group.id}>
								<Flex
									width="100%"
									height="100%"
									align="center"
									justify="center"
									style={{ zIndex: 2 }}
								>
									{getInitials(group.name)}
								</Flex>
							</GroupContextMenu>
						</SideNavigationLink>
					</div>
				</Tooltip>
			))}
		</Flex>
	);
};

export default GroupList;
