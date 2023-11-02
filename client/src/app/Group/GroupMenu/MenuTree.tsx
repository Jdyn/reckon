import { Droppable } from '@hello-pangea/dnd';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { ContextMenu, IconButton, Text } from '@radix-ui/themes';
import { animated } from '@react-spring/web';
import { BillCategory, useDeleteCategoryMutation } from '@reckon/core';
import Alert from '~/components/Alert';
import Tree from '~/components/Tree';

import styles from './GroupMenu.module.css';

interface GroupMenuTreeProps {
	droppableId: string;
	category: BillCategory;
}

const GroupMenuTree = ({ droppableId, category }: GroupMenuTreeProps) => {
	const [deleteCategory] = useDeleteCategoryMutation();

	return (
		<Droppable droppableId={droppableId}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.droppableProps}
					style={{
						borderRadius: 'var(--radius-3)',
						background: snapshot.isDraggingOver ? `var(--accent-a3)` : ''
					}}
				>
					<Tree droppableId={droppableId}>
						<Tree.Header>
							<ContextMenu.Root>
								<ContextMenu.Trigger>
									<animated.div
										className={styles.header}
										style={{ opacity: children ? 1 : 0.3 }}
										onClick={() => setOpen(!isOpen)}
									>
										<IconButton size="1" variant="ghost" style={{ margin: 0 }}>
											{isOpen ? <MinusIcon width="14px" /> : <PlusIcon width="14px" />}
										</IconButton>
										<Text
											className={styles.label}
											color="gray"
											weight="medium"
											size="2"
											trim="both"
										>
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
										}}
									>
										Delete Category
									</Alert>
								</ContextMenu.Content>
							</ContextMenu.Root>
						</Tree.Header>
					</Tree>
					{provided.placeholder}
				</div>
			)}
		</Droppable>
	);
};

export default GroupMenuTree;
