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
	useState
} from 'react';
import type {
	CSSProperties,
	DetailedHTMLProps,
	Dispatch,
	HTMLAttributes,
	ReactElement,
	ReactNode
} from 'react';
import useDimensions from 'react-cool-dimensions';
import { Link, To, matchPath, useLocation } from 'react-router-dom';

import styles from './SidePanel.module.css';

const SidePanelContext = createContext<{
	value: string | undefined;
	setValue: Dispatch<React.SetStateAction<string | undefined>>;
	expanded: boolean;
} | null>(null);

export const useSidePanel = () => {
	const context = useContext(SidePanelContext);
	if (!context) throw new Error('useSidePanel must be used within a SidePanelProvider');
	return context;
};

interface SidePanelProps extends HTMLAttributes<HTMLDivElement> {
	direction: 'left' | 'right';
	children: ReactNode;
	style?: React.CSSProperties;
	maxWidth?: string;
	expanded: boolean;
	onExpandedChange?: (expanded: boolean) => void;
	controlled?: boolean;
}

export function SidePanel(props: SidePanelProps) {
	const {
		style,
		direction,
		children,
		maxWidth,
		expanded,
		onExpandedChange,
		controlled,
		className,
		...rest
	} = props;
	const [value, setValue] = useState<string | undefined>(undefined);

	const [_expanded, setExpanded] = useState(true);

	const ArrowIcon = useMemo(
		() =>
			_expanded && direction === 'left' ? (
				<PinRightIcon width="20px" height="20px" />
			) : _expanded && direction === 'right' ? (
				<PinLeftIcon width="20px" height="20px" />
			) : direction === 'left' ? (
				<PinLeftIcon width="20px" height="20px" />
			) : (
				<PinRightIcon width="20px" height="20px" />
			),
		[_expanded, direction]
	);

	return (
		<NavigationMenu.Root
			className={styles.sidePanel}
			style={{ ...style, width: _expanded ? maxWidth : '75px' }}
			orientation="vertical"
			data-expanded={_expanded}
			data-direction={direction}
			value={value}
		>
			<SidePanelContext.Provider value={{ value, setValue, expanded: _expanded }}>
				<div
					style={{ ...style, width: _expanded ? maxWidth : '75px' }}
					className={clsx(styles.wrapper, className)}
					{...rest}
					data-direction={direction}
				>
					{children}
					{/* {!controlled && (
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
					)} */}
				</div>
			</SidePanelContext.Provider>
		</NavigationMenu.Root>
	);
}

SidePanel.defaultProps = {
	style: {},
	children: null,
	maxWidth: '275px',
	value: undefined,
	expanded: true,
	controlled: false,
	onExpandedChange: null
};

interface SideNavigationListProps {
	children?: ReactNode[];
	style?: CSSProperties;
}

export const SideNavigationList = ({ children, style }: SideNavigationListProps) => {
	const { observe, width } = useDimensions();

	return (
		<NavigationMenu.List ref={observe} style={style} asChild>
			<div className={styles.list}>
				{children}
				<NavigationMenu.Indicator className={styles.indicator} style={{ width: width }} />
			</div>
		</NavigationMenu.List>
	);
};

export const SideNavigationLink = forwardRef<
	HTMLButtonElement,
	DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement> & { to?: To }, HTMLAnchorElement>
>(({ children, to, onClick }, ref) => {
	const { setValue } = useSidePanel();
	const { pathname } = useLocation();

	useEffect(() => {
		if (to) {
			const match = matchPath({ path: to.toString(), end: false }, location.pathname);
			if (match) setValue(to.toString());
		}
	}, [pathname, setValue, to]);

	return to ? (
		<NavigationMenu.Item value={to && to.toString()} asChild>
			<NavigationMenu.Trigger ref={ref} asChild>
				<Link
					className={styles.listItem}
					onClick={(e) => {
						setValue(to.toString());
						onClick && onClick(e);
					}}
					to={to}
				>
					{children}
				</Link>
			</NavigationMenu.Trigger>
		</NavigationMenu.Item>
	) : (
		<div className={styles.listItem}>{children}</div>
	);
});
