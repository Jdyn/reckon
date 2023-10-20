import { PinLeftIcon, PinRightIcon } from '@radix-ui/react-icons';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Flex } from '@radix-ui/themes';
import clsx from 'clsx';
import {
	AnchorHTMLAttributes,
	createContext,
	forwardRef,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';
import type { DetailedHTMLProps, Dispatch, ReactElement, ReactNode } from 'react';
import useDimensions from 'react-cool-dimensions';
import { Link, LinkProps, matchPath, useLocation } from 'react-router-dom';
import { mergeRefs } from '~/utils/mergeRefs';

import styles from './SideMenu.module.css';

interface SideMenuProps {
	expand: 'left' | 'right';
	children: ReactElement<LinkProps>[] | ReactNode;
	style?: React.CSSProperties;
}

const SideMenuContext = createContext<{
	value: string | undefined;
	setValue: Dispatch<React.SetStateAction<string | undefined>>;
	listRef?: any;
} | null>(null);

const useSideMenu = () => {
	const context = useContext(SideMenuContext);
	if (!context) throw new Error('useSideMenu must be used within a SideMenuProvider');
	return context;
};

export function SideMenu({ style, expand, children }: SideMenuProps) {
	const [expanded, setExpanded] = useState(false);
	const [value, setValue] = useState<string | undefined>(undefined);

	const ArrowIcon = useMemo(
		() =>
			expanded && expand === 'left' ? (
				<PinRightIcon width="18px" height="18px" />
			) : expanded && expand === 'right' ? (
				<PinLeftIcon width="18px" height="18px" />
			) : expand === 'left' ? (
				<PinLeftIcon width="18px" height="18px" />
			) : (
				<PinRightIcon width="18px" height="18px" />
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
		>
			<SideMenuContext.Provider value={{ value, setValue }}>
				<div className={styles.wrapper} data-expand={expand}>
					<NavigationMenu.Item asChild>
						<button
							className={styles.collapse}
							onClick={() => setExpanded((p) => !p)}
							data-expanded={expanded}
							data-expand={expand}
							type="button"
						>
							{ArrowIcon}
						</button>
					</NavigationMenu.Item>
					{children}
				</div>
			</SideMenuContext.Provider>
		</NavigationMenu.Root>
	);
}

SideMenu.defaultProps = {
	style: {},
	children: null
};

interface SideNavigationListProps {
	children?: ReactNode[];
}

export const SideNavigationList = ({ children }: SideNavigationListProps) => {
	const { observe, width } = useDimensions();
	const items = useSideMenu();
	const listRef = useRef<HTMLDivElement>(null);
	const [offset, setOffset] = useState();

	return (
		<SideMenuContext.Provider value={{ ...items, listRef }}>
			<NavigationMenu.List ref={mergeRefs(observe, listRef)} asChild>
				<div className={styles.list}>
					{children}
					<NavigationMenu.Indicator
						id="test"
						className={styles.indicator}
						style={{ width: '48px' }}
						// style={{ width: width, transform: `translateY(${10}px)` }}
					/>
				</div>
			</NavigationMenu.List>
		</SideMenuContext.Provider>
	);
};

interface SideNavigationLinkProps {
	children: [ReactNode, ReactNode];
}

export const SideNavigationLink = forwardRef<
	HTMLButtonElement,
	DetailedHTMLProps<
		AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps & SideNavigationLinkProps,
		HTMLAnchorElement
	>
>(({ children, to, onClick }, ref) => {
	const [icon, child] = children;
	const { setValue } = useSideMenu();
	const { pathname } = useLocation();

	useEffect(() => {
		const match = matchPath({ path: to.toString(), end: false }, location.pathname);
		if (match) {
			setValue(to.toString());
		}
	}, [pathname, setValue, to]);

	return (
		<NavigationMenu.Item value={to.toString()} asChild>
			<NavigationMenu.Trigger ref={ref} asChild>
				<Flex gap="3" pr="4" align="center" asChild>
					<Link
						onClick={(e) => {
							setValue(to.toString());
							onClick && onClick(e);
						}}
						className={clsx(styles.listItem)}
						to={to}
					>
						<Flex p="3" className={styles.listItemIcon} asChild>{icon}</Flex>
						{child}
					</Link>
				</Flex>
			</NavigationMenu.Trigger>
		</NavigationMenu.Item>
	);
});
