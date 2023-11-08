import GroupMenu from '~/app/Group/GroupMenu';
import { SidePanel } from '~/components/SidePanel';

import HomeMenu from '../HomeMenu';
import styles from './LeftPanel.module.css';
import VerticalMenu from './VerticalMenu';

const LeftPanel = () => {
	return (
		<SidePanel className={styles.leftPanel} direction="right">
			<VerticalMenu />
			<GroupMenu />
			<HomeMenu />
		</SidePanel>
	);
};

export default LeftPanel;
