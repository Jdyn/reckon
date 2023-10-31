import { HashtagIcon, NewspaperIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { Button, Flex, Heading, IconButton, Separator, Text, Tooltip } from '@radix-ui/themes';
import { useBillListQuery, useGetGroupQuery } from '@reckon/core';
import { useMemo } from 'react';
import { useMatch } from 'react-router-dom';
import SideMenuList from '~/components/SideMenu/SideMenuList';
import Tree from '~/components/Tree';

const GroupMenu = () => {
	const match = useMatch({ path: '/g/:id', caseSensitive: false, end: false });

	const groupId = useMemo(() => {
		if (!match?.params.id || isNaN(parseInt(match.params.id, 10))) return undefined;
		return parseInt(match.params.id, 10);
	}, [match]);

	const { data: bills } = useBillListQuery({ groupId, type: 'group' });

	const { data: group } = useGetGroupQuery(groupId, { skip: !groupId });

	return match ? (
		<SideMenuList>
			<Flex align="center" justify="between" pt="2">
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
			<Flex align="center" gap="1">
				<Separator size="4" />
				<Text size="1" color="gray" weight="medium" style={{ textTransform: 'uppercase' }}>
					stories
				</Text>
				<Separator size="4" />
			</Flex>
			<Flex direction="column" gap="2">
				<Tree name="bills">
					{bills &&
						bills.map((bill) => (
							<Flex key={bill.id} justify="start" gap="1" style={{ margin: 0 }} asChild>
								<Button variant="ghost">
									<HashtagIcon height="14px" />
									<Text size="2" weight="medium">
										{bill.description}
									</Text>
								</Button>
							</Flex>
						))}
				</Tree>
				<Tree name="bills">
					{bills &&
						bills.map((bill) => (
							<Flex key={bill.id} justify="start" gap="1" style={{ margin: 0 }} asChild>
								<Button variant="ghost">
									<HashtagIcon height="14px" />
									<Text size="2" weight="medium">
										{bill.description}
									</Text>
								</Button>
							</Flex>
						))}
				</Tree>
			</Flex>
		</SideMenuList>
	) : null;
};

export default GroupMenu;
