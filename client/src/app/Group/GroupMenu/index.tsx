import { DragDropContext, Draggable, DropResult, Droppable } from '@hello-pangea/dnd';
import {
	EllipsisHorizontalIcon,
	HashtagIcon,
	NewspaperIcon,
	RectangleStackIcon
} from '@heroicons/react/24/outline';
import {
	Button,
	Dialog,
	DropdownMenu,
	Flex,
	Heading,
	IconButton,
	Separator,
	Text,
	TextField
} from '@radix-ui/themes';
import {
	useBillListQuery,
	useCreateCategoryMutation,
	useGetGroupQuery,
	useUpdateBillMutation
} from '@reckon/core';
import { FormEvent, useMemo, useState } from 'react';
import { useMatch } from 'react-router-dom';
import SideMenuList from '~/components/SideMenu/SideMenuList';
import Tree from '~/components/Tree';
import { formatTimeAgo } from '~/utils/dates';

import MenuTreeItem from './MenuTreeItem';

// import styles from './Group.module.css';

const GroupMenu = () => {
	const match = useMatch({ path: '/g/:id', caseSensitive: false, end: false });
	const [newName, setName] = useState('');

	const groupId = useMemo(() => {
		if (!match?.params.id || isNaN(parseInt(match.params.id, 10))) return undefined;
		return parseInt(match.params.id, 10);
	}, [match]);

	const [open, setOpen] = useState({
		category: false
	});

	const [createCategory] = useCreateCategoryMutation();

	const handleDialog = (key: string, state: boolean) => {
		setOpen((prev) => ({ ...prev, [key]: state }));
	};

	const handleCreateCategory = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (groupId) {
			createCategory({ groupId, body: { name: newName } });
		}
	};

	const { data: bills } = useBillListQuery({ groupId, type: 'group' }, { skip: !groupId });

	const { data: group } = useGetGroupQuery(groupId, { skip: !groupId });
	const [updateBill] = useUpdateBillMutation();

	const onDragEnd = ({ destination, source, draggableId }: DropResult) => {
		if (!destination || source.droppableId === destination.droppableId) return;

		updateBill({
			billId: parseInt(draggableId),
			body: { category_id: parseInt(destination.droppableId) }
		});
	};

	return match ? (
		<SideMenuList>
			<Flex align="center" justify="between" pt="2">
				<Heading size="3">{group?.name}</Heading>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<IconButton variant="ghost">
							<EllipsisHorizontalIcon width="18px" />
						</IconButton>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content style={{ width: '216px' }}>
						<Dialog.Root
							open={open['category']}
							onOpenChange={(open) => handleDialog('category', open)}
						>
							<Dialog.Trigger>
								<DropdownMenu.Item
									onClick={(e) => {
										e.preventDefault();
										handleDialog('category', true);
									}}
								>
									Create category
									<RectangleStackIcon width="18px" />
								</DropdownMenu.Item>
							</Dialog.Trigger>
							<Dialog.Content style={{ maxWidth: 450 }}>
								<Dialog.Title align="center">Create Category</Dialog.Title>
								<Dialog.Description color="gray" align="center">
									Orangize your bills into different categories to keep them easy to find.
								</Dialog.Description>
								<Flex direction="column" mt="3">
									<form onSubmit={handleCreateCategory}>
										<Text>Category Name</Text>
										<TextField.Input
											placeholder="New category"
											value={newName}
											onChange={(e) => setName(e.target.value)}
										/>
										<Flex gap="3" mt="4" justify="end">
											<Dialog.Close>
												<Button variant="soft" color="gray">
													cancel
												</Button>
											</Dialog.Close>
											<Button type="submit" variant="soft" color="green">
												Create
											</Button>
										</Flex>
									</form>
								</Flex>
							</Dialog.Content>
						</Dialog.Root>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Flex>

			<SideMenuList.Link to={`${match.pathname}/feed`}>
				<NewspaperIcon width="18px" />
				Feed
			</SideMenuList.Link>
			<Flex align="center" gap="1">
				<Separator size="4" />
				<Text size="1" color="gray" weight="medium" style={{ textTransform: 'uppercase' }}>
					stories
				</Text>
				<Separator size="4" />
			</Flex>
			<DragDropContext onDragEnd={onDragEnd}>
				<Flex direction="column" gap="2">
					<Droppable droppableId="null">
						{(provided, snapshot) => (
							<div
								ref={provided.innerRef}
								{...provided.droppableProps}
								style={{
									minHeight: snapshot.draggingFromThisWith ? 32 : 0,
									borderRadius: 'var(--radius-3)',
									background: snapshot.isDraggingOver ? `var(--accent-a3)` : ''
								}}
							>
								{bills
									?.filter((b) => b.category_id === null)
									.map((bill, index) => (
										<MenuTreeItem key={bill.id} bill={bill} index={index} />
									))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
					{group?.bill_categories?.map((category) => (
						<Tree key={category.id} category={category}>
							{bills
								?.filter((b) => b.category_id === category.id)
								.map((bill, index) => (
									<MenuTreeItem key={bill.id} bill={bill} index={index} />
								))}
						</Tree>
					))}
				</Flex>
			</DragDropContext>
		</SideMenuList>
	) : null;
};

export default GroupMenu;
