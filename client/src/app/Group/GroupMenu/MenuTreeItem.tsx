import { Draggable } from '@hello-pangea/dnd';
import { HashtagIcon } from '@heroicons/react/24/outline';
import { Flex, Text } from '@radix-ui/themes';
import { Bill } from '@reckon/core';
import clsx from 'clsx';
import { formatTimeAgo } from '~/utils/dates';

import styles from './GroupMenu.module.css';
import { NavLink, useMatch } from 'react-router-dom';

interface MenuTreeItemProps {
	bill: Bill;
	index: number;
}

const MenuTreeItem = (props: MenuTreeItemProps) => {
	const { index, bill } = props;
	const match = useMatch({ path: '/g/:id', caseSensitive: false, end: false });

	return (
		<Draggable index={index} draggableId={bill.id.toString()} disableInteractiveElementBlocking>
			{({ innerRef, dragHandleProps, draggableProps }, { isDragging }) => (
				<NavLink
					ref={innerRef}
					style={draggableProps.style}
					className={clsx(styles.listItem, isDragging && styles.dragging)}
					to={`${match?.pathname}/bill/${bill.id}`}
					{...draggableProps}
					{...dragHandleProps}
				>
					<Flex gap="1" align="center">
						<HashtagIcon height="14px" />
						<Text weight="medium">
							{bill.description}
						</Text>
					</Flex>
					<Text size="2">{formatTimeAgo(bill.inserted_at, false)}</Text>
				</NavLink>
			)}
		</Draggable>
	);
};

export default MenuTreeItem;
