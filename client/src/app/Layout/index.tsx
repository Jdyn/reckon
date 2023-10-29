import { GlobeEuropeAfricaIcon, PlusIcon } from '@heroicons/react/24/outline';
import { HomeIcon } from '@radix-ui/react-icons';
import {
	Button,
	Dialog,
	Flex,
	Heading,
	HoverCard,
	Separator,
	Text,
	TextField,
	Tooltip
} from '@radix-ui/themes';
import { useCreateGroupMutation } from '@reckon/core';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
// import { Background } from '@reckon/ui';
import { Outlet, useMatch, useParams, useSearchParams } from 'react-router-dom';
import UserList from '~/app/Auth/UserList';
import sideMenuStyles from '~/components/SideMenu/SideMenu.module.css';

import { SideMenu, SideNavigationLink, SideNavigationList } from '../../components/SideMenu';
import BillView from '../Bills/BillView';
import Compose from '../Bills/Compose';
import { ComposeProvider } from '../Bills/Compose/ComposeProvider';
import GroupList from '../Group/GroupList';
import GroupMenu from '../Group/GroupMenu';
import Header from './Header';
import HomeMenu from './HomeMenu';
import styles from './Layout.module.css';
import ProfileLink from './ProfileLink';

export function RootLayout() {
	const [createGroup] = useCreateGroupMutation();
	const [form, setForm] = useState({ name: '' });
	const { id } = useParams<{ id: string }>();
	const gMatch = useMatch({ path: '/g/:id', end: false });
	const [queryParams] = useSearchParams();

	const isBillView = useMemo(() => queryParams.get('bill') !== null, [queryParams]);

	const [userListExpanded, setUserListExpanded] = useState(true);

	return (
		<div className={styles.root}>
			<SideMenu expand="right">
				<Flex height="9" justify="start" align="center" width="100%" px="3">
					<Heading size="5" trim="both">
						Tehee
					</Heading>
				</Flex>
				<div className={styles.menu}>
					<SideNavigationList>
						<Dialog.Root>
							<Dialog.Trigger>
								<div className={clsx(sideMenuStyles.listItem, styles.newGroupHover)}>
									<PlusIcon width="24px" />
								</div>
							</Dialog.Trigger>
							<Dialog.Content style={{ maxWidth: 450 }}>
								<Flex direction="column" gap="4">
									<Heading>New Group</Heading>
									<label>
										<Text weight="bold">Group Name</Text>
										<TextField.Input
											placeholder="Derby Gang"
											onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
											value={form.name}
										/>
									</label>
								</Flex>
								<Flex justify="end" mt="5" gap="4">
									<Dialog.Close>
										<Button variant="outline">Cancel</Button>
									</Dialog.Close>
									<Button variant="solid" onClick={() => createGroup({ name: form.name })}>
										Create
									</Button>
								</Flex>
							</Dialog.Content>
						</Dialog.Root>

						{/* <HoverCard.Root>
							<HoverCard.Trigger>
								<div>
									<SideNavigationLink to="/feed">
										<GlobeEuropeAfricaIcon width="24px" height="24px" />
									</SideNavigationLink>
								</div>
							</HoverCard.Trigger>
							<HoverCard.Content size="1" side="right">
								For you
							</HoverCard.Content>
						</HoverCard.Root> */}

						<Tooltip content="For You" side="right" delayDuration={300}>
							<div>
								<SideNavigationLink to="/feed">
									<GlobeEuropeAfricaIcon width="24px" height="24px" />
								</SideNavigationLink>
							</div>
						</Tooltip>

						<Tooltip content="Home" side="right" delayDuration={300}>
							<div>
								<SideNavigationLink to="/home">
									<HomeIcon width="24px" height="24px" />
								</SideNavigationLink>
							</div>
						</Tooltip>

						<Separator size="4" />

						<GroupList />
					</SideNavigationList>

					<GroupMenu />

					<HomeMenu />
				</div>
			</SideMenu>
			<ComposeProvider>
				<div className={styles.container}>
					<Header />
					<div className={styles.wrapper}>
						<Outlet />
						<Compose />
					</div>
				</div>
			</ComposeProvider>
			<SideMenu
				expand="left"
				controlled={isBillView ? true : false}
				maxWidth={isBillView ? '275px' : '275px'}
				expanded={isBillView ? true : userListExpanded}
				onExpandedChange={(e) => setUserListExpanded(e)}
			>
				<ProfileLink />
				{isBillView ? (
					<BillView />
				) : (
					<UserList title={gMatch ? 'Members' : 'Friends'} presence={gMatch ? `group:${id}` : ''} />
				)}
			</SideMenu>
			{/* <Background /> */}
		</div>
	);
}
