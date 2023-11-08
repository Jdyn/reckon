import { Button, Flex, Heading, Separator } from '@radix-ui/themes';
import { CSSProperties, ReactNode } from 'react';
import { NavLink, To } from 'react-router-dom';

import styles from './SidePanel.module.css';

interface SideMenuList {
	children: ReactNode[];
	style?: CSSProperties;
}

const SideMenulist = ({ children, style }: SideMenuList) => {
	const [header, ...rest] = children;

	return (
		<div className={styles.listRoot} style={style}>
			{header}
			<Flex gap="2" direction="column">
				{rest}
			</Flex>
		</div>
	);
};

interface SideMenuListLink {
	to: To;
	children: ReactNode;
}

const SideMenuListLink = ({ to, children }: SideMenuListLink) => {
	return (
		<Button variant="soft" highContrast asChild>
			<Flex justify="start" asChild>
				<NavLink to={to}>{children}</NavLink>
			</Flex>
		</Button>
	);
};

export default Object.assign(SideMenulist, { Link: SideMenuListLink });
