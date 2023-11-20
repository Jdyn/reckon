import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd';
import {
	EllipsisHorizontalIcon,
	FolderPlusIcon,
	InformationCircleIcon,
	MagnifyingGlassIcon,
	NewspaperIcon,
	UserPlusIcon
} from '@heroicons/react/24/outline';
import {
	Callout,
	DropdownMenu,
	Flex,
	Heading,
	IconButton,
	Separator,
	Tabs,
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
import { NavLink, useMatch } from 'react-router-dom';
import DialogItem from '~/components/DialogItem';
import { useSidePanel } from '~/components/SidePanel';
import Tree from '~/components/Tree';

import styles from '../Menu.module.css';
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
		<div className={styles.root}>
			<Flex align="center" height="9" justify="between" mx="2">
				<Heading size="4">{group?.name}</Heading>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<IconButton variant="ghost">
							<EllipsisHorizontalIcon width="24px" />
						</IconButton>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content style={{ width: 'calc(216px * var(--scaling))' }}>
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
							<Flex direction="column" gap="2" my="4">
								<Text>Category Name</Text>
								<TextField.Input
									placeholder="New category"
									value={newName}
									onChange={(e) => setName(e.target.value)}
								/>
							</Flex>
						</DialogItem>
						<DialogItem
							title={`Invite friends to ${group?.name}`}
							type="dropdown"
							action="Create"
							onClick={handleCreateCategory}
						>
							<>
								Invite Friends
								<UserPlusIcon width="18px" />
							</>
							<Tabs.Root defaultValue="existing">
								<Tabs.List>
									<Tabs.Trigger value="existing">Existing User</Tabs.Trigger>
									<Tabs.Trigger value="nonexisting">Non-Existing User</Tabs.Trigger>
								</Tabs.List>

								<Tabs.Content value="existing">
									<Flex direction="column" my="3">
										{/* <Callout.Root>
										<Callout.Icon>
											<InformationCircleIcon width="18px" />
										</Callout.Icon>
										<Callout.Text>
											Invite an existing user of the platform to your group.
										</Callout.Text>
									</Callout.Root> */}
										<Flex direction="column" gap="3" my="3">
											<label>
												<Text as="div" size="3" mb="1" weight="bold">
													Identifier
												</Text>
												<TextField.Root>
													<TextField.Slot>
														<MagnifyingGlassIcon width="14px" />
													</TextField.Slot>
													<TextField.Input
														id="existing-user-id"
														placeholder="Phone, Email, Username"
														// value={identifier}
														// onChange={(e) => setIdentifer(e.target.value)}
													/>
												</TextField.Root>
											</label>
										</Flex>
									</Flex>
								</Tabs.Content>

								<Tabs.Content value="nonexisting">
									<Flex direction="column" my="3">
										{/* <Callout.Root>
										<Callout.Icon>
											<InformationCircleIcon width="14px" />
										</Callout.Icon>
										<Callout.Text>
											Invite a new user to the platform and to your group.
										</Callout.Text>
									</Callout.Root> */}
										<Flex direction="column" gap="3" my="3">
											<label>
												<Text as="div" mb="1" weight="bold">
													Name
												</Text>
												<TextField.Input placeholder="John" />
											</label>
											<label>
												<Text as="div" mb="1" weight="bold">
													Identifier
												</Text>
												<TextField.Root>
													<TextField.Slot>
														<MagnifyingGlassIcon width="18px" />
													</TextField.Slot>
													<TextField.Input placeholder="Phone, Email" />
												</TextField.Root>
											</label>
										</Flex>
									</Flex>
								</Tabs.Content>
							</Tabs.Root>
						</DialogItem>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Flex>

			<NavLink className={styles.listItem} to={`${match.pathname}/feed`}>
				<Flex gap="1" align="center">
					<NewspaperIcon width="14px" />
					<Text weight="medium">Feed</Text>
				</Flex>
			</NavLink>

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
									gap: 'var(--space-3)',
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
		</div>
	) : null;
};

export default GroupMenu;
