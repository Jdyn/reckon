import { useMemo, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import UserList from '~/app/Auth/UserList';

import { SidePanel } from '../../components/SidePanel';
import BillView from '../Bills/BillView';
import Compose from '../Bills/Compose';
import Header from './Header';
import styles from './Layout.module.css';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

export function RootLayout() {
	return (
		<div className={styles.root}>
			<LeftPanel />
			<div className={styles.main}>
				<Header />
				<div className={styles.wrapper}>
					<Outlet />
					<Compose />
				</div>
			</div>
			<RightPanel />
		</div>
	);
}
