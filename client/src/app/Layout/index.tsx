import { PlusIcon } from '@heroicons/react/24/outline';
import { HomeIcon } from '@radix-ui/react-icons';
import { Button, Dialog, Flex, Heading, Separator, Text, TextField } from '@radix-ui/themes';
import { useCreateGroupMutation } from '@reckon/core';
import { useState } from 'react';
// import { Background } from '@reckon/ui';
import { Outlet } from 'react-router-dom';
import { PhoenixProvider } from 'use-phoenix';
import GroupMemberList from '~/app/Group/MemberList';

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

	return (
		<div className={styles.root}>
			<PhoenixProvider>
				<Header />
				<SideMenu expand="right">
					<div className={styles.menu}>
						<SideNavigationList>
							<Dialog.Root>
								<Dialog.Trigger>
									<SideNavigationLink to=".">
										<PlusIcon width="24px" />
									</SideNavigationLink>
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
								<HomeIcon width="24px" height="24px" />
							</SideNavigationLink>
							<Separator size="4" />
							<GroupList />
						</SideNavigationList>
						<GroupMenu />
						<HomeMenu />
					</div>
					<ProfileLink />
				</SideMenu>
				<div className={styles.container}>
					<div className={styles.wrapper}>
						<Outlet />
					</div>
				</div>
				<SideMenu expand="left">
					<GroupMemberList />
				</SideMenu>
				{/* <Background /> */}
			</PhoenixProvider>
		</div>
	);
}
