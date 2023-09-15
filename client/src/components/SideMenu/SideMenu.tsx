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
	if (!context) {
		throw new Error('useSideMenu must be used within a SideMenuProvider');
	}
	return context;
};

export function SideMenu({ style, expand, children }: SideMenuProps) {
	const [expanded, setExpanded] = useState(true);
	const [value, setValue] = useState<string | undefined>(undefined);
	// const [current, setCurrent] = useState<string | undefined>(undefined);

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
			// onValueChange={(v) => setValue(() => (v ? v : current))}
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

interface SideMenuNavList {
	children?: ReactElement<LinkProps>[] | ReactElement<LinkProps>;
}

export const SideNavigationList = ({ children }: SideMenuNavList) => {
	const { setValue } = useSideMenu();
	const location = useLocation();
	const { observe, width } = useDimensions();

	const routes: Record<string, any> = useMemo(() => {
		if (Array.isArray(children)) {
			return children.reduce((acc, child, index) => {
				acc[`${child.props.to}`] = index;
				return acc;
			}, {} as Record<string, any>);
		}
		return {};
	}, [children]);

	useEffect(() => {
		Object.keys(routes).forEach((key: string) => {
			const match = matchPath({ path: key, end: false }, location.pathname);
			if (match) {
				const index = routes[key].toString();
				setValue(index);
				// setCurrent(index);
			}
		});
	}, [location.pathname, routes, setValue]);

	return (
		<NavigationMenu.List className={styles.list} ref={observe}>
			{children && Array.isArray(children) ? (
				children.map((child, index) => (
					<NavigationMenu.Item key={child.props.to.toString()} value={index.toString()}>
						{child}
					</NavigationMenu.Item>
				))
			) : (
				<NavigationMenu.Item key={1} value={'0'}>
					{children}
				</NavigationMenu.Item>
			)}
			<NavigationMenu.Indicator className={styles.indicator} style={{ width: width }} />
		</NavigationMenu.List>
	);
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
