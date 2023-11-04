import { Tooltip } from '@radix-ui/themes';
import { ReactNode, forwardRef, memo } from 'react';
import { To } from 'react-router-dom';
import { SideNavigationLink } from '~/components/SidePanel';

interface VerticalMenuItemProps {
	children: ReactNode;
	tooltip: string;
	to?: To;
}

const VerticalMenuItem = ({ children, tooltip, to }: VerticalMenuItemProps) => {
	return (
		<Tooltip content={tooltip} side="right" delayDuration={300}>
			<SideNavigationLink to={to}>{children}</SideNavigationLink>
		</Tooltip>
	);
};

export default memo(VerticalMenuItem);
