import { NewspaperIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { Flex, Heading, IconButton, Tooltip } from '@radix-ui/themes';
import { useGetGroupQuery } from '@reckon/core';
import { useMemo } from 'react';
import { useMatch } from 'react-router-dom';
import SideMenuList from '~/components/SideMenu/SideMenuList';

const GroupMenu = () => {
	const match = useMatch({ path: '/g/:id', caseSensitive: false, end: false });

	const groupId = useMemo(() => {
		if (!match?.params.id || isNaN(parseInt(match.params.id, 10))) return undefined;
		return parseInt(match.params.id, 10);
	}, [match]);

	const { data: group } = useGetGroupQuery(groupId, { skip: !groupId });

	return match ? (
		<SideMenuList>
			<Flex align="center" justify="between" height="6">
				<Heading size="3">{group?.name}</Heading>
				<Tooltip content="start a new bill">
					<IconButton variant="ghost">
						<UserPlusIcon width="18px" />
					</IconButton>
				</Tooltip>
			</Flex>

			<SideMenuList.Link to={`${match.pathname}/feed`}>
				<NewspaperIcon width="18px" />
				Feed
			</SideMenuList.Link>
		</SideMenuList>
	) : null;
};

export default GroupMenu;
