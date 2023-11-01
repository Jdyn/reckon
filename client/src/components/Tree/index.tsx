import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ContextMenu, Flex, IconButton, Text } from '@radix-ui/themes';
import { animated, useSpring } from '@react-spring/web';
import { BillCategory, useDeleteCategoryMutation } from '@reckon/core';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import useMeasure from 'react-use-measure';

import Alert from '../Alert';
import styles from './Tree.module.css';

function usePrevious<T>(value: T) {
	const ref = useRef<T>();
	useEffect(() => void (ref.current = value), [value]);
	return ref.current;
}

const Tree = React.memo<
	React.HTMLAttributes<HTMLDivElement> & {
		defaultOpen?: boolean;
		category: BillCategory;
	}
>(({ children, category, defaultOpen = true }) => {
	const [isOpen, setOpen] = useState(defaultOpen);
	const previous = usePrevious(isOpen);
	const [ref, { height: viewHeight }] = useMeasure();
	const [deleteCategory] = useDeleteCategoryMutation();
	const { height, opacity, y } = useSpring({
		from: { height: 0, opacity: 0, y: 0 },
		to: {
			height: isOpen ? viewHeight : 0,
			opacity: isOpen ? 1 : 0,
			y: isOpen ? 0 : 40
		}
	});

	return (
		<Flex direction="column" className={styles.root}>
			<ContextMenu.Root>
				<ContextMenu.Trigger>
					<animated.div
						className={styles.header}
						style={{ opacity: children ? 1 : 0.3 }}
						onClick={() => setOpen(!isOpen)}>
						<IconButton size="1" variant="ghost" style={{ margin: 0 }}>
							{isOpen ? <MinusIcon width="14px" /> : <PlusIcon width="14px" />}
						</IconButton>
						<Text className={styles.label} color="gray" weight="medium" size="2" trim="both">
							{category.name}
						</Text>
					</animated.div>
				</ContextMenu.Trigger>
				<ContextMenu.Content alignOffset={50} size="1">
					<Alert
						title="Delete Category"
						description="Are you sure? This cannot be undone."
						action="delete"
						type="context"
						onClick={() => {
							deleteCategory({ categoryId: category.id, groupId: category.group_id });
						}}>
						Delete Category
					</Alert>
				</ContextMenu.Content>
			</ContextMenu.Root>
			<Flex direction="column" asChild>
				<animated.div
					style={{
						opacity,
						height: isOpen && previous === isOpen ? 'auto' : height
					}}>
					<Flex direction="column" asChild>
						<animated.div ref={ref}>{children}</animated.div>
					</Flex>
				</animated.div>
			</Flex>
		</Flex>
	);
});

export default Tree;
