import { PlusIcon } from '@heroicons/react/24/outline';
import { HomeIcon } from '@radix-ui/react-icons';
import { Button, Dialog, Flex, Heading, Separator, Text, TextField } from '@radix-ui/themes';
import { useCreateGroupMutation } from '@reckon/core';
import { useState } from 'react';
// import { Background } from '@reckon/ui';
import { Outlet, useMatch, useParams } from 'react-router-dom';
import UserList from '~/app/Group/UserList';
import sideMenuStyles from '~/components/SideMenu/SideMenu.module.css';

import { SideMenu, SideNavigationLink, SideNavigationList } from '../../components/SideMenu';
import GroupList from './GroupList';
import GroupMenu from './GroupMenu';
import Header from './Header';
import HomeMenu from './HomeMenu';
import styles from './Layout.module.css';
import ProfileLink from './ProfileLink';

export function RootLayout() {
	const [createGroup] = useCreateGroupMutation();
	const [form, setForm] = useState({ name: '' });
	const { id } = useParams<{ id: string }>();
	const gMatch = useMatch({ path: '/g/:id', end: false });

	return (
		<div className={styles.root}>
			<SideMenu expand="right">
				<Flex style={{ height: '30px' }} />
				{/* <div className={styles.menu}> */}
				<SideNavigationList>
					<Dialog.Root>
						<Dialog.Trigger>
							<div className={sideMenuStyles.listItem}>
								<PlusIcon width="24px" />
								New
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
					<Flex gap="3" align="center">
						<SideNavigationLink to="/feed">
							<HomeIcon width="24px" height="24px" />
						</SideNavigationLink>
						<Flex>
							<Text>Home</Text>
						</Flex>
					</Flex>
					<Separator size="4" />
					<GroupList />
				</SideNavigationList>
				{/* <GroupMenu />
					<HomeMenu /> */}
				{/* </div> */}
				<ProfileLink />
			</SideMenu>
			<div className={styles.container}>
				<Header />
				<div className={styles.wrapper}>
					<Outlet />
				</div>
			</div>
			<SideMenu expand="left">
				<Flex style={{ height: '30px' }} />

				<UserList title={gMatch ? 'members' : 'friends'} presence={gMatch ? `group:${id}` : ''} />
			</SideMenu>
			{/* <Background /> */}
		</div>
	);
}
