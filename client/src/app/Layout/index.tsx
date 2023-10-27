import { GlobeEuropeAfricaIcon, PlusIcon } from '@heroicons/react/24/outline';
import { HomeIcon } from '@radix-ui/react-icons';
import { Button, Dialog, Flex, Heading, Separator, Text, TextField } from '@radix-ui/themes';
import { useCreateGroupMutation } from '@reckon/core';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
// import { Background } from '@reckon/ui';
import { Outlet, useMatch, useParams, useSearchParams } from 'react-router-dom';
import UserList from '~/app/Auth/UserList';
import sideMenuStyles from '~/components/SideMenu/SideMenu.module.css';

import { SideMenu, SideNavigationLink, SideNavigationList } from '../../components/SideMenu';
import BillView from '../Bills/BillView';
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

						<SideNavigationLink to="/feed">
							<GlobeEuropeAfricaIcon width="24px" height="24px" />
						</SideNavigationLink>

						<SideNavigationLink to="/home">
							<HomeIcon width="24px" height="24px" />
						</SideNavigationLink>

						<Separator size="4" />

						<GroupList />
					</SideNavigationList>

					<GroupMenu />

					<HomeMenu />
				</div>
			</SideMenu>
			<div className={styles.container}>
				<Header />
				<div className={styles.wrapper}>
					<Outlet />
				</div>
			</div>
			<SideMenu
				expand="left"
				controlled={isBillView ? true : false}
				maxWidth={isBillView ? '350px' : '225px'}
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
