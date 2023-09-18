import { HomeIcon } from '@radix-ui/react-icons';
import { Separator } from '@radix-ui/themes';
import { useGetGroupsQuery } from '@reckon/core';
import { Background } from '@reckon/ui';
import { Outlet } from 'react-router-dom';
import { PhoenixProvider } from 'use-phoenix';
import GroupMemberList from '~/app/Group/MemberList';

import { SideMenu, SideNavigationLink, SideNavigationList } from '../SideMenu';
import Header from './Header';
import styles from './Layout.module.css';

function getInitials(input: string): string {
	return input
		.split(' ')
		.map((word) => (word[0] as string).toUpperCase())
		.slice(0, 2)
		.join('');
}

export function RootLayout() {
	const { data } = useGetGroupsQuery();

	return (
		<PhoenixProvider>
			<div className={styles.root}>
				<main className={styles.main}>
					<Header />
					<SideMenu expand="right">
						<div className={styles.container}>
							<SideNavigationList>
								<SideNavigationLink key={'me'} to={`/feed`}>
									<HomeIcon width="24px" height="24px" />
								</SideNavigationLink>
								<Separator size="4" />
								{(data?.groups || []).map((group) => (
									<SideNavigationLink key={group.id} to={`/groups/${group.id}`}>
										<span>{getInitials(group.name)}</span>
									</SideNavigationLink>
								))}
							</SideNavigationList>
						</div>
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
