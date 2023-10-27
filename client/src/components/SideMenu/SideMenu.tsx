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
	useState
} from 'react';
import type { DetailedHTMLProps, Dispatch, ReactElement, ReactNode } from 'react';
import useDimensions from 'react-cool-dimensions';
import { Link, LinkProps, matchPath, useLocation } from 'react-router-dom';

import styles from './SideMenu.module.css';

const SideMenuContext = createContext<{
	value: string | undefined;
	setValue: Dispatch<React.SetStateAction<string | undefined>>;
} | null>(null);

const useSideMenu = () => {
	const context = useContext(SideMenuContext);
	if (!context) throw new Error('useSideMenu must be used within a SideMenuProvider');
	return context;
};

interface SideMenuProps {
	expand: 'left' | 'right';
	children: ReactElement<LinkProps>[] | ReactNode;
	style?: React.CSSProperties;
	maxWidth?: string;
	expanded?: boolean | undefined;
	onExpandedChange?: (expanded: boolean) => void;
	controlled?: boolean;
}

export function SideMenu(props: SideMenuProps) {
	const { style, expand, children, maxWidth, expanded, onExpandedChange, controlled } = props;
	const [value, setValue] = useState<string | undefined>(undefined);

	const [_expanded, setExpanded] = useState<boolean | undefined>(expanded || true);

	useEffect(() => {
		if (expanded !== null) {
			setExpanded(expanded);
		}
	}, [expanded]);

	const ArrowIcon = useMemo(
		() =>
			_expanded && expand === 'left' ? (
				<PinRightIcon width="18px" height="18px" />
			) : _expanded && expand === 'right' ? (
				<PinLeftIcon width="18px" height="18px" />
			) : expand === 'left' ? (
				<PinLeftIcon width="18px" height="18px" />
			) : (
				<PinRightIcon width="18px" height="18px" />
			),
		[_expanded, expand]
	);

	return (
		<NavigationMenu.Root
			className={styles.root}
			style={{ ...style, width: _expanded ? maxWidth : '75px' }}
			orientation="vertical"
			data-expanded={_expanded}
			data-expand={expand}
			value={value}
		>
			<SideMenuContext.Provider value={{ value, setValue }}>
				<div className={styles.wrapper} data-expand={expand}>
					<Flex height="9" justify="start" align="center" width="100%" px="3" />
					{!controlled && (
						<NavigationMenu.Item asChild>
							<button
								className={styles.collapse}
								onClick={() => {
									setExpanded(!_expanded);
									onExpandedChange && onExpandedChange(!_expanded);
								}}
								data-expanded={_expanded}
								data-expand={expand}
								type="button"
							>
								{ArrowIcon}
							</button>
						</NavigationMenu.Item>
					)}
					{children}
				</div>
			</SideMenuContext.Provider>
		</NavigationMenu.Root>
	);
}

SideMenu.defaultProps = {
	style: {},
	children: null,
	maxWidth: '225px',
	value: undefined,
	expanded: true,
	controlled: false,
	onExpandedChange: null
};

interface SideNavigationListProps {
	children?: ReactNode[];
}

export const SideNavigationList = ({ children }: SideNavigationListProps) => {
	const { observe, width } = useDimensions();

	return (
		<NavigationMenu.List ref={observe} asChild>
			<div className={styles.list}>
				{children}
				<NavigationMenu.Indicator className={styles.indicator} style={{ width: width }} />
			</div>
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
		if (match) setValue(to.toString());
	}, [pathname, setValue, to]);

	return (
		<NavigationMenu.Item value={to.toString()} asChild>
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
