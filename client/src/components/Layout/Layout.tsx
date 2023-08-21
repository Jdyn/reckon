import { HomeIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import { Background } from '@reckon/ui';
import { SideMenu, SideNavigationLink, SideNavigationList } from '@reckon/ui';
import { Outlet } from 'react-router-dom';

import GroupDropdown from '../GroupDropdown/GroupDropdown';
import Header from './Header';
import styles from './Layout.module.css';

export function RootLayout() {
	return (
		<div className={styles.root}>
			<main className={styles.main}>
				<Header />
				<SideMenu expand="right">
					<GroupDropdown />
					<SideNavigationList>
						<SideNavigationLink to="/home">
							<HomeIcon width="18px" height="18px" /> <span>Home</span>
						</SideNavigationLink>
						<SideNavigationLink to="/overview">
							<PaperPlaneIcon width="18px" height="18px" /> <span>Home</span>
						</SideNavigationLink>
					</SideNavigationList>
				</SideMenu>
				<div className={styles.container}>
					<div className={styles.wrapper}>
						<Outlet />
					</div>
				</div>
				<SideMenu expand="left" />
			</main>
			<Background />
		</div>
	);
}
