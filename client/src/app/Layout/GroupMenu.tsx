import {
	EllipsisHorizontalIcon,
	InformationCircleIcon,
	MagnifyingGlassIcon,
	NewspaperIcon,
	PlusCircleIcon,
	PlusSmallIcon,
	UserPlusIcon
} from '@heroicons/react/24/outline';
import {
	AlertDialog,
	Button,
	Callout,
	Dialog,
	DropdownMenu,
	Flex,
	Heading,
	IconButton,
	Tabs,
	Text,
	TextField,
	Tooltip
} from '@radix-ui/themes';
import {
	useAccountQuery,
	useDeleteGroupMutation,
	useGetGroupQuery,
	useLeaveGroupMutation
} from '@reckon/core';
import { useMemo, useState } from 'react';
import { useMatch } from 'react-router-dom';
import Error from '~/components/Error';
import SideMenuList from '~/components/SideMenu/SideMenuList';

import styles from './Layout.module.css';

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
