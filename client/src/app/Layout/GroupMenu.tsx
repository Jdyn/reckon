import { NewspaperIcon, PlusSmallIcon } from '@heroicons/react/24/outline';
import { Flex, Heading, IconButton, Tooltip } from '@radix-ui/themes';
import { useGetGroupQuery } from '@reckon/core';
import { useMatch } from 'react-router-dom';
import SideMenuList from '~/components/SideMenu/SideMenuList';

const GroupMenu = () => {
	const match = useMatch({ path: '/g/:id', caseSensitive: false, end: false });
	const { data: group } = useGetGroupQuery(match?.params.id, { skip: !match });

	return match ? (
		<SideMenuList>
			<Flex direction="row" align="center" justify="between" height="6">
				<Heading size="3">{group?.name}</Heading>
				<Tooltip content="start a new bill">
					<IconButton variant="ghost">
						<PlusSmallIcon width="18px" />
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
