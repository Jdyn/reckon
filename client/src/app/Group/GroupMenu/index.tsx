import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd';
import {
	EllipsisHorizontalIcon,
	FolderPlusIcon,
	NewspaperIcon,
	RectangleStackIcon
} from '@heroicons/react/24/outline';
import {
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
import { useMemo, useState } from 'react';
import { useMatch } from 'react-router-dom';
import DialogItem from '~/components/DialogItem';
import SideMenuList from '~/components/SideMenu/SideMenuList';
import Tree from '~/components/Tree';

import MenuTreeItem from './MenuTreeItem';

const GroupMenu = () => {
	const match = useMatch({ path: '/g/:id', caseSensitive: false, end: false });
	const [newName, setName] = useState('');

	const groupId = useMemo(() => {
		if (!match?.params.id || isNaN(parseInt(match.params.id, 10))) return undefined;
		return parseInt(match.params.id, 10);
	}, [match]);

	const [createCategory] = useCreateCategoryMutation();
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

	const handleCreateCategory = (e: any) => {
		e.preventDefault();

		if (groupId) {
			createCategory({ groupId, body: { name: newName } });
		}
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
						<DialogItem
							title="Create Category"
							description="Orangize your bills into different categories to keep them easy to find."
							type="dropdown"
							action="Create"
							onClick={handleCreateCategory}
						>
							<>
								Create category
								<FolderPlusIcon width="18px" />
							</>
							<Flex direction="column">
								<Text>Category Name</Text>
								<TextField.Input
									placeholder="New category"
									value={newName}
									onChange={(e) => setName(e.target.value)}
								/>
							</Flex>
						</DialogItem>
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
				<Flex direction="column" gap="1">
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
								.map((bill, i) => (
									<MenuTreeItem key={bill.id} bill={bill} index={i} />
								))}
						</Tree>
					))}
				</Flex>
			</DragDropContext>
		</SideMenuList>
	) : null;
};

export default GroupMenu;
