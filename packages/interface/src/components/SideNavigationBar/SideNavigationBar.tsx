import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import React, { useState } from 'react';
import { Link, useNavigation } from 'react-router-dom';

import styles from './SideNavigationBar.module.css';

interface SideNavigationBarProps {
	expand: 'left' | 'right';
}

const SideNavigationBar = ({ expand }: SideNavigationBarProps) => {
	const [expanded, setExpanded] = useState(false);

	return (
		<NavigationMenu.Root
			className={styles.root}
			orientation="vertical"
			data-hover-expand={true}
			data-expanded={expanded}
		>
			<div className={styles.wrapper} data-expand={expand}>
				<div className={styles.list}>
					<NavigationMenu.Item className={styles.listItem} asChild>
						<SideNavigationLink href="/overview">Overview</SideNavigationLink>
					</NavigationMenu.Item>
				</div>
				<NavigationMenu.Item asChild>
					<button className={styles.collapse} onClick={() => setExpanded((prev) => !prev)}>
						{expanded ? 'Collapse' : 'Expand'}
					</button>
				</NavigationMenu.Item>
			</div>
		</NavigationMenu.Root>
	);
};

const SideNavigationLink = ({
	href,
	children,
	...props
}: {
	href: string;
	children: React.ReactNode;
}) => {
	const { location } = useNavigation();
	const isActive = location?.pathname === href;

	return (
		<Link to={href}>
			<NavigationMenu.Link className="NavigationMenuLink" active={isActive} {...props} />
		</Link>
	);
};

export default SideNavigationBar;
