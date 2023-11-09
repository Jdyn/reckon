import { Button, Flex, Tooltip } from '@radix-ui/themes';
import { ReactNode, forwardRef, memo } from 'react';
import { NavLink, To } from 'react-router-dom';
import SidePanel from '~/components/SidePanel';

import styles from './LeftPanel.module.css';

interface VerticalMenuItemProps {
	children: ReactNode;
	tooltip: string;
	to?: To;
}

const VerticalMenuItem = ({ children, tooltip, to }: VerticalMenuItemProps) => {
	return (
		<Tooltip content={tooltip} side="right" delayDuration={300}>
			<SidePanel.Item className={styles.menuItem} to={to}>{children}</SidePanel.Item>
		</Tooltip>
	);
};

export default memo(VerticalMenuItem);
