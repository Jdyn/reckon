import { Outlet } from 'react-router-dom';
import Compose from '../Bills/Compose';
import Header from './Header';
import styles from './Layout.module.css';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

export function RootLayout() {
	return (
		<div className={styles.root}>
			<main className={styles.container}>
				<LeftPanel />
				<div className={styles.main}>
					<Header />
					<div className={styles.wrapper}>
						<Outlet />
						<Compose />
					</div>
				</div>
				<RightPanel />
			</main>
		</div>
	);
}
