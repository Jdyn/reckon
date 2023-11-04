import { useMemo, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import UserList from '~/app/Auth/UserList';

import { SidePanel } from '../../components/SidePanel';
import BillView from '../Bills/BillView';
import Compose from '../Bills/Compose';
import Header from './Header';
import styles from './Layout.module.css';
import LeftPanel from './LeftPanel';

export function RootLayout() {
	const [queryParams] = useSearchParams();
	const isBillView = useMemo(() => queryParams.get('bill') !== null, [queryParams]);

	const [userListExpanded, setUserListExpanded] = useState(true);

	return (
		<div className={styles.root}>
			<Header />
			<div className={styles.full}>
				<div className={styles.container}>
					<SidePanel direction="right">
						<LeftPanel />
					</SidePanel>
					<div className={styles.wrapper}>
						<Outlet />
						<Compose />
					</div>
					<SidePanel
						direction="left"
						controlled={isBillView ? true : false}
						maxWidth={isBillView ? '275px' : '275px'}
						expanded={isBillView ? true : userListExpanded}
						onExpandedChange={(e) => setUserListExpanded(e)}
					>
						{isBillView ? <BillView /> : <UserList />}
					</SidePanel>
				</div>
			</div>
		</div>
	);
}
