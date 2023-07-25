import { Outlet } from 'react-router-dom';

import SideNavigationBar from '../SideNavigationBar';
import styles from './Layout.module.css';

const RootLayout = () => {
	return (
		<main className={styles.main}>
			<SideNavigationBar expand="right" />
			<section className={styles.root}>
				<nav className={styles.nav}>nav</nav>
				<div className={styles.wrapper}>
					<Outlet />
				</div>
			</section>
			<SideNavigationBar expand="left" />
		</main>
	);
};

export default RootLayout;
