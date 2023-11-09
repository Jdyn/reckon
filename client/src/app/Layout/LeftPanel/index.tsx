import GroupMenu from '~/app/Layout/LeftPanel/Menus/GroupMenu';
import { SidePanel } from '~/components/SidePanel';

import HomeMenu from './Menus/HomeMenu';
import styles from './LeftPanel.module.css';
import VerticalMenu from './VerticalMenu';
import { Separator } from '@radix-ui/themes';

const LeftPanel = () => {
	return (
		<SidePanel className={styles.leftPanel} direction="right">
			<VerticalMenu />
			<Separator size="4" orientation="vertical" />
			<GroupMenu />
			<HomeMenu />
		</SidePanel>
	);
};

export default LeftPanel;
