/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import clsx from 'clsx';
import { AnchorHTMLAttributes, forwardRef, useEffect, useMemo, useState } from 'react';
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
			const test = children.reduce((acc, child, index) => {
				acc[`${child.props.to}/*`] = index;
				return acc;
			}, {});

			console.log(test)
		}

		if (Array.isArray(children)) {
			const result: Record<string, any> = {};
			children.map((child, index) => {
				result[`${child.props.to}/*`] = index;
			});

			console.log(result)
			return result;
		}
		return {};


	}, [children]);

	console.log(routes)

	useEffect(() => {
		Object.keys(routes).forEach((key: string) => {
			const match = matchPath({ path: key, end: false, caseSensitive: false }, location.pathname);
			if (match) {
				const index = routes[key].toString();
				setValue(index);
				setCurrent(index);
			}
		});
	}, [location.pathname]);

	const ArrowIcon = useMemo(
		() =>
			expanded && expand === 'left' ? (
				<ArrowRightIcon width="18px" height="18px" />
			) : expanded && expand === 'right' ? (
				<ArrowLeftIcon width="18px" height="18px" />
			) : expand === 'left' ? (
				<ArrowLeftIcon width="18px" height="18px" />
			) : (
				<ArrowRightIcon width="18px" height="18px" />
			),
		[expanded, expand]
	);

	return (
		<NavigationMenu.Root
			className={styles.root}
			style={style}
			orientation="vertical"
			data-expanded={expanded}
			data-expand={expand}
			value={value}
			onValueChange={(v) => setValue(() => (v ? v : current))}
		>
			<div className={styles.wrapper} data-expand={expand} ref={observe}>
				<NavigationMenu.Item asChild>
					<button
						className={styles.collapse}
						onClick={() => setExpanded((prev) => !prev)}
						style={{ justifyContent: expand === 'right' ? 'flex-end' : 'flex-start' }}
						type="button"
					>
						{ArrowIcon}
					</button>
				</NavigationMenu.Item>
				<NavigationMenu.List className={styles.list}>
					{Array.isArray(children)
						? children.map((child, index) => (
								<NavigationMenu.Item key={index} value={`${index}`}>
									{child}
								</NavigationMenu.Item>
						  ))
						: children}
					<NavigationMenu.Indicator className={styles.indicator} style={{ width: width - 20 }} />
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
	DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps, HTMLAnchorElement>
>(({ children, to, onClick }, ref) => (
	<NavigationMenu.Trigger ref={ref} asChild>
		<Link onClick={onClick} id={to.toString()} className={clsx(styles.listItem)} to={to}>
			{children}
		</Link>
	</NavigationMenu.Trigger>
));
