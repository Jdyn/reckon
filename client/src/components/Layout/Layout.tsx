import { HomeIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import { Background } from '@reckon/ui';
import { SideMenu, SideNavigationLink, SideNavigationList } from '@reckon/ui';
import { Outlet } from 'react-router-dom';
import { PhoenixProvider } from 'use-phoenix';
import GroupDropdown from '~/app/Group/Dropdown';

import Header from './Header';
import styles from './Layout.module.css';
import GroupMemberList from '~/app/Group/MemberList';

export function RootLayout() {
	return (
		<PhoenixProvider options={ {  } }>
			<div className={styles.root}>
				<main className={styles.main}>
					<Header />
					<SideMenu expand="right">
						<GroupDropdown />
						<SideNavigationList>
							<SideNavigationLink to="/home">
								<HomeIcon width="18px" height="18px" /> <span>Feed</span>
							</SideNavigationLink>
							<SideNavigationLink to="/group">
								<PaperPlaneIcon width="18px" height="18px" /> <span>Group</span>
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
