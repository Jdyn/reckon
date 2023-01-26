import styles from './Layout.module.css';
import { Outlet } from 'react-router-dom';

import SideNavigationBar from '../SideNavigationBar';

const RootLayout = () => {
	return (
		<main className={styles.main}>
			<SideNavigationBar expand="right"/>
			<section className={styles.root}>
				<Outlet />
			</section>
			<SideNavigationBar expand="left"/>
		</main>
	);
};

export default RootLayout;
