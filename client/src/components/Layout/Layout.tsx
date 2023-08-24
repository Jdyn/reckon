import { CardStackIcon, HomeIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import { Group } from '@reckon/core';
import { Background } from '@reckon/ui';
import { SideMenu, SideNavigationLink, SideNavigationList } from '@reckon/ui';
import { useMemo, useState } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import { PhoenixProvider } from 'use-phoenix';
import GroupDropdown from '~/app/Group/Dropdown';
import GroupMemberList from '~/app/Group/MemberList';

import Header from './Header';
import styles from './Layout.module.css';

export function RootLayout() {
	const [group, setGroup] = useState<Group | null>(null);
	const match = useMatch({ path: '/groups/:id', end: true });
	const groupId = useMemo(() => match?.params?.id || group?.id, [match?.params?.id, group?.id]);

	return (
		<PhoenixProvider>
			<div className={styles.root}>
				<main className={styles.main}>
					<Header />
					<SideMenu expand="right">
						<GroupDropdown
							selectedGroup={(newGroup) => {
								setGroup(newGroup);
							}}
						/>
						<SideNavigationList>
							<SideNavigationLink to="/feed">
								<HomeIcon width="18px" height="18px" /> <span>Feed</span>
							</SideNavigationLink>
							<SideNavigationLink to="/pay">
								<CardStackIcon width="18px" height="18px" /> <span>pay</span>
							</SideNavigationLink>
							<SideNavigationLink to={groupId ? `/groups/${groupId}` : 'groups'}>
								<PaperPlaneIcon width="18px" height="18px" />
								<span>{group?.name || 'groups'}</span>
							</SideNavigationLink>
						</SideNavigationList>
					</SideMenu>
					<div className={styles.container}>
						<div className={styles.wrapper}>
							<Outlet />
						</div>
					</div>
					<SideMenu expand="left">
						<GroupMemberList />
					</SideMenu>
				</main>
				<Background />
			</div>
		</PhoenixProvider>
	);
}
