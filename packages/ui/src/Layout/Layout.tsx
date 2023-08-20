import { HomeIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import { Outlet } from 'react-router-dom';

import Background from '../Background';
import { SideNavigation, SideNavigationLink } from '../SideNavigation';
import Header from './Header';
import styles from './Layout.module.css';

export function RootLayout() {
	return (
		<div className={styles.root}>
			<main className={styles.main}>
			<Header />
				<SideNavigation expand="right">
					<SideNavigationLink to="/overview">
						<PaperPlaneIcon width="18px" height="18px" /> <span>Overview</span>
					</SideNavigationLink>
					<SideNavigationLink to="/home">
						<HomeIcon width="18px" height="18px" /> <span>Home</span>
					</SideNavigationLink>
				</SideNavigation>
				<div className={styles.container}>
					<div className={styles.wrapper}>
						<Outlet />
					</div>
				</div>
				<SideNavigation expand="left" />
			</main>
			<Background />
		</div>
	);
}
