import {
	EllipsisHorizontalIcon,
	MagnifyingGlassIcon,
	NewspaperIcon,
	PlusCircleIcon,
	UserPlusIcon
} from '@heroicons/react/24/outline';
import {
	AlertDialog,
	Button,
	Dialog,
	DropdownMenu,
	Flex,
	IconButton,
	Text,
	TextField,
	Tooltip
} from '@radix-ui/themes';
import {
	useAccountQuery,
	useDeleteGroupMutation,
	useGetGroupQuery,
	useLeaveGroupMutation
} from '@reckon/core';
import { useMemo, useState } from 'react';
import { useMatch } from 'react-router-dom';
import Error from '~/components/Error';
import SideMenuList from '~/components/SideMenu/SideMenuList';

const GroupMenu = () => {
	const match = useMatch({ path: '/g/:id', caseSensitive: false, end: false });
	const { data: group } = useGetGroupQuery(match?.params.id, { skip: !match });
	const [deleteGroup] = useDeleteGroupMutation();
	const [leaveGroup] = useLeaveGroupMutation();
	const { data: user } = useAccountQuery();
	const [open, setOpen] = useState({
		invite: false,
		delete: false
	});

	const isCreator = useMemo(
		() => group?.creator.id === user?.id || false,
		[group?.creator.id, user?.id]
	);

	const handleDelete = () => {};

	const handleDialog = (key: string, state: boolean) => {
		setOpen((prev) => ({ ...prev, [key]: state }));
	};

	return match ? (
		<SideMenuList>
			<>
				{group?.name}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<IconButton variant="ghost">
							<EllipsisHorizontalIcon width="18px" />
						</IconButton>
					</DropdownMenu.Trigger>

					<DropdownMenu.Content style={{ width: '216px' }}>
						<Dialog.Root
							open={open['invite']}
							onOpenChange={(open) => handleDialog('invite', open)}
						>
							<Dialog.Trigger>
								<DropdownMenu.Item
									onClick={(e) => {
										e.preventDefault();
										handleDialog('invite', true);
									}}
								>
									Invite friends
								</DropdownMenu.Item>
							</Dialog.Trigger>
							<Dialog.Content style={{ maxWidth: 450 }}>
								<Dialog.Title>Invite friends to {group?.name}</Dialog.Title>
								<Flex direction="column" asChild>
									<label>
										<Text as="div" size="2" mb="1" weight="bold">
											Identifier
										</Text>
										<TextField.Root>
											<TextField.Slot>
												<MagnifyingGlassIcon width="18px" />
											</TextField.Slot>
											<TextField.Input defaultValue="" placeholder="Phone, Email, Username" />
											<TextField.Slot>
												<Tooltip content="Send invite!">
													<IconButton size="1" variant="soft">
														<UserPlusIcon width="18px" />
													</IconButton>
												</Tooltip>
											</TextField.Slot>
										</TextField.Root>
									</label>
								</Flex>
								<Flex gap="3" mt="4" justify="end">
									<Dialog.Close>
										<Button variant="soft">Done</Button>
									</Dialog.Close>
								</Flex>
							</Dialog.Content>
						</Dialog.Root>

						<AlertDialog.Root
							open={open['delete']}
							onOpenChange={(open) => handleDialog('delete', open)}
						>
							<AlertDialog.Trigger>
								<DropdownMenu.Item
									color="red"
									onClick={(e) => {
										e.preventDefault();
										handleDialog('delete', true);
									}}
								>
									{isCreator ? 'Delete group' : 'Leave group'}
								</DropdownMenu.Item>
							</AlertDialog.Trigger>
							<AlertDialog.Content style={{ maxWidth: 450 }}>
								<AlertDialog.Title>
									{isCreator ? 'Delete' : 'Leave'} {group?.name}?
								</AlertDialog.Title>
								<Error text="Are you sure you want to? This cannot be undone." />
								<Flex gap="3" mt="4" justify="end">
									<AlertDialog.Cancel>
										<Button variant="outline">Cancel</Button>
									</AlertDialog.Cancel>
									<AlertDialog.Action onClick={handleDelete}>
										<Button
											variant="solid"
											color="red"
											onClick={() => {
												if (group) {
													isCreator ? deleteGroup(group.id) : leaveGroup(group.id);
												}
											}}
										>
											{isCreator ? 'Delete' : 'Leave'}
										</Button>
									</AlertDialog.Action>
								</Flex>
							</AlertDialog.Content>
						</AlertDialog.Root>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</>

			<SideMenuList.Link to={`${match.pathname}/feed`}>
				<NewspaperIcon width="18px" />
				Feed
			</SideMenuList.Link>

			<SideMenuList.Link to={`${match.pathname}/new`}>
				<PlusCircleIcon width="18px" />
				New Bill
			</SideMenuList.Link>
		</SideMenuList>
	) : null;
};

export default GroupMenu;
