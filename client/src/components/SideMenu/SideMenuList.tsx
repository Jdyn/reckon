import { Button, Flex, Heading, Separator } from '@radix-ui/themes';
import { ReactNode } from 'react';
import { NavLink, To } from 'react-router-dom';

import styles from './SideMenu.module.css';

interface SideMenuList {
	children: ReactNode[];
}

const SideMenulist = ({ children }: SideMenuList) => {
	const [header, ...rest] = children;

	return (
		<div className={styles.listRoot}>
			<Flex asChild align="center" justify="between" height="6">
				<Heading size="4">{header}</Heading>
			</Flex>
			<Separator size="4" />
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
