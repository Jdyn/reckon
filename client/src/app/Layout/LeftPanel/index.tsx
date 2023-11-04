import GroupMenu from '~/app/Group/GroupMenu';
import { useSidePanel } from '~/components/SidePanel';

import HomeMenu from '../HomeMenu';
import styles from './LeftPanel.module.css';
import VerticalMenu from './VerticalMenu';

const LeftPanel = () => {
	return (
		<div className={styles.leftPanel}>
			<VerticalMenu />
			<GroupMenu />
			<HomeMenu />
		</div>
	);
};

export default LeftPanel;
