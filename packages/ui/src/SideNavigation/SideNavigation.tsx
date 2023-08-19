/* eslint-disable react/no-array-index-key */

/* eslint-disable no-nested-ternary */
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import clsx from 'clsx';
import { AnchorHTMLAttributes, cloneElement, forwardRef, useEffect, useMemo, useState } from 'react';
import type { DetailedHTMLProps, ReactNode } from 'react';
import useDimensions from 'react-cool-dimensions';
import { Link, LinkProps, matchPath, useLocation } from 'react-router-dom';

import styles from './SideNavigation.module.css';

interface SideNavigationProps {
	expand: 'left' | 'right';
	children: ReactNode;
	style?: React.CSSProperties;
}

export function SideNavigation({ style, expand, children }: SideNavigationProps) {
	const [expanded, setExpanded] = useState(true);
	const [value, setValue] = useState<string | undefined>(undefined);
	const { observe, width } = useDimensions();
	const location = useLocation();
	const [current, setCurrent] = useState<string | undefined>(undefined);

	const routes = useMemo(() => {
		if (Array.isArray(children)) {
			const result: Record<string, number> = {};
			children.map((child, index) => {
				result[`${child.props.to}/*`] = index;
			});
			return result;
		}
		return {};
	}, [children]);

	useEffect(() => {
		Object.keys(routes).forEach((key) => {
			const match = matchPath({ path: key, end: false, caseSensitive: false }, location.pathname);
			if (match) {
				const index = routes[key].toString();
				setValue(index);
				setCurrent(index);
			}
		});
	}, [location.pathname]);

	return (
		<NavigationMenu.Root
			className={styles.root}
			style={style}
			orientation="vertical"
			data-hover-expand
			data-expanded={expanded}
			data-expand={expand}
			value={value}
			onValueChange={(newValue) => {
				setValue(() => {
					if (newValue) return newValue;
					return current;
				});
			}}
		>
			<div className={styles.wrapper} data-expand={expand} ref={observe}>
				<NavigationMenu.Item asChild>
					<button
						className={styles.collapse}
						onClick={() => setExpanded((prev) => !prev)}
						style={{ justifyContent: expand === 'right' ? 'flex-end' : 'flex-start' }}
						type="button"
						title="collapse side menu"
					>
						{expanded && expand === 'left' ? (
							<ArrowRightIcon width="18px" height="18px" />
						) : expanded && expand === 'right' ? (
							<ArrowLeftIcon width="18px" height="18px" />
						) : expand === 'left' ? (
							<ArrowLeftIcon width="18px" height="18px" />
						) : (
							<ArrowRightIcon width="18px" height="18px" />
						)}
					</button>
				</NavigationMenu.Item>
				<NavigationMenu.List asChild >
					<div className={styles.list}>
						{Array.isArray(children) ? (
							children.map((child, index) => (
								<NavigationMenu.Item
									key={index}
									value={`${index}`}
									asChild
									className={clsx(value === index.toString() && styles.active)}
								>
									<NavigationMenu.Link asChild>{cloneElement(child, { expanded })}</NavigationMenu.Link>
								</NavigationMenu.Item>
							))
						) : (
							<NavigationMenu.Item
								value="0"
								asChild
								className={clsx(value === '0' && styles.active)}
							>
								<NavigationMenu.Link asChild>{children}</NavigationMenu.Link>
							</NavigationMenu.Item>
						)}
						<NavigationMenu.Indicator
							tabIndex={-1}
							className={styles.indicator}
							style={{ width: width - 20 }}
						/>
					</div>
				</NavigationMenu.List>
			</div>
		</NavigationMenu.Root>
	);
}

SideNavigation.defaultProps = {
	style: {},
	children: null
};

export const SideNavigationLink = forwardRef<
	HTMLButtonElement,
	DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps & { expanded?: boolean; }, HTMLAnchorElement>
>(({ children, to, onClick, expanded }, ref) => (
	<NavigationMenu.Trigger ref={ref} asChild>
		<Link onClick={onClick} id={to.toString()} className={clsx(styles.listItem)} to={to}>
			{children}
		</Link>
	</NavigationMenu.Trigger>
));
