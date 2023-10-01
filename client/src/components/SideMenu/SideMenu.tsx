import { PinLeftIcon, PinRightIcon } from '@radix-ui/react-icons';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
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
	const [expanded, setExpanded] = useState(true);
	const [value, setValue] = useState<string | undefined>(undefined);

	const ArrowIcon = useMemo(
		() =>
			expanded && expand === 'left' ? (
				<PinRightIcon width="24px" height="24px" />
			) : expanded && expand === 'right' ? (
				<PinLeftIcon width="24px" height="24px" />
			) : expand === 'left' ? (
				<PinLeftIcon width="24px" height="24px" />
			) : (
				<PinRightIcon width="24px" height="24px" />
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
						style={{ width: width }}
						// style={{ width: width, transform: `translateY(${10}px)` }}
					/>
				</div>
			</NavigationMenu.List>
		</SideMenuContext.Provider>
	);
};

export const SideNavigationLink = forwardRef<
	HTMLButtonElement,
	DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps, HTMLAnchorElement>
>(({ children, to, onClick }, ref) => {
	const { setValue, value, listRef } = useSideMenu();
	const { pathname } = useLocation();

	useEffect(() => {
		const match = matchPath({ path: to.toString(), end: false }, location.pathname);
		if (match) {
			setValue(to.toString());
		}
	}, [pathname, setValue, to]);
	const onNodeUpdate = (trigger: HTMLButtonElement | null, itemValue: string) => {
		const list = listRef.current;
		if (trigger && list && value === itemValue) {
			const listHeight = list.offsetHeight;
			// console.log(list.scrollTop);
			// const listCenter = listWidth / 2;

			// const triggerOffsetRight =
			//   listWidth -
			//   trigger.offsetLeft -
			//   trigger.offsetWidth +
			//   trigger.offsetWidth / 2;
			console.log(list.scrollTop)
			// console.log(Math.round(listHeight - list.scrollTop));

			// setOffset(Math.round(listCenter - triggerOffsetRight));
		} else if (value === '') {
			// setOffset(null);
		}
		return trigger;
	};

	return (
		<NavigationMenu.Item value={to.toString()} asChild>
			<NavigationMenu.Trigger
				ref={(node) => {
					onNodeUpdate(node, to.toString());
					return ref;
				}}
				asChild
			>
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
