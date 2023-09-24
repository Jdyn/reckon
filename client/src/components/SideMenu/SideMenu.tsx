import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import clsx from 'clsx';
import {
	AnchorHTMLAttributes,
	createContext,
	forwardRef,
	useContext,
	useEffect,
	useMemo,
	useState
} from 'react';
import type { DetailedHTMLProps, Dispatch, ReactElement, ReactNode } from 'react';
import useDimensions from 'react-cool-dimensions';
import { Link, LinkProps, matchPath, useLocation } from 'react-router-dom';

import styles from './SideMenu.module.css';
import { ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

interface SideMenuProps {
	expand: 'left' | 'right';
	children: ReactElement<LinkProps>[] | ReactNode;
	style?: React.CSSProperties;
}

const SideMenuContext = createContext<{
	value: string | undefined;
	setValue: Dispatch<React.SetStateAction<string | undefined>>;
} | null>(null);

const useSideMenu = () => {
	const context = useContext(SideMenuContext);
	if (!context) throw new Error('useSideMenu must be used within a SideMenuProvider');
	return context;
};

export function SideMenu({ style, expand, children }: SideMenuProps) {
	const [expanded, setExpanded] = useState(true);
	const [value, setValue] = useState<string | undefined>(undefined);

	const ArrowIcon = useMemo(
		() =>
			expanded && expand === 'left' ? (
				<ArrowRightOnRectangleIcon width="24px" height="24px" />
			) : expanded && expand === 'right' ? (
				<ArrowLeftOnRectangleIcon width="24px" height="24px" />
			) : expand === 'left' ? (
				<ArrowLeftOnRectangleIcon width="24px" height="24px" />
			) : (
				<ArrowRightOnRectangleIcon width="24px" height="24px" />
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

	return (
		<NavigationMenu.List className={styles.list} ref={observe}>
			{children}
			<NavigationMenu.Indicator className={styles.indicator} style={{ width: width }} />
		</NavigationMenu.List>
	);
};

export const SideNavigationLink = forwardRef<
	HTMLButtonElement,
	DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps, HTMLAnchorElement>
>(({ children, to, onClick }, ref) => {
	const { setValue } = useSideMenu();
	const { pathname } = useLocation();

	useEffect(() => {
		const match = matchPath({ path: to.toString(), end: false }, location.pathname);
		if (match) {
			setValue(to.toString());
		}
	}, [pathname, setValue, to])

	return (
		<NavigationMenu.Item value={to.toString()}>
			<NavigationMenu.Trigger ref={ref} asChild>
				<Link
					onClick={(e) => {
						setValue(to.toString());
						onClick && onClick(e);
					}}
					className={clsx(styles.listItem)}
					to={to}
				>
					{children}
				</Link>
			</NavigationMenu.Trigger>
		</NavigationMenu.Item>
	);
});
