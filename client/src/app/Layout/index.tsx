import { PlusIcon } from '@heroicons/react/24/outline';
import { HomeIcon } from '@radix-ui/react-icons';
import { Separator } from '@radix-ui/themes';
// import { Background } from '@reckon/ui';
import { Outlet } from 'react-router-dom';
import { PhoenixProvider } from 'use-phoenix';
import GroupMemberList from '~/app/Groups/MemberList';

import { SideMenu, SideNavigationLink, SideNavigationList } from '../../components/SideMenu';
import GroupList from './GroupList';
import Header from './Header';
import styles from './Layout.module.css';

export function RootLayout() {
	return (
		<div className={styles.root}>
			<PhoenixProvider>
				<Header />
				<SideMenu expand="right">
					<SideNavigationList>
						<SideNavigationLink to="/group/new">
							<PlusIcon width="24px" />
						</SideNavigationLink>
						<SideNavigationLink to="/feed">
							<HomeIcon width="24px" height="24px" />
						</SideNavigationLink>
						<Separator size="4" />
						<GroupList />
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
				{/* <Background /> */}
			</PhoenixProvider>
		</div>
	);
}
