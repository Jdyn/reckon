import {
	InformationCircleIcon,
	MagnifyingGlassIcon,
	PlusSmallIcon,
	UserPlusIcon
} from '@heroicons/react/24/outline';
import {
	AlertDialog,
	Button,
	Callout,
	ContextMenu,
	Dialog,
	Flex,
	Heading,
	IconButton,
	Tabs,
	Text,
	TextField,
	Tooltip
} from '@radix-ui/themes';
import {
	Group,
	useAccountQuery,
	useDeleteGroupMutation,
	useGetGroupQuery,
	useLeaveGroupMutation
} from '@reckon/core';
import { ReactNode, useMemo, useState } from 'react';
import { useMatch } from 'react-router-dom';
import Error from '~/components/Error';

interface GroupContextMenuProps {
	children: ReactNode;
	groupId: string;
}

const GroupContextMenu = ({ children, groupId }: GroupContextMenuProps) => {
	const { data: group } = useGetGroupQuery(groupId, { skip: !groupId });
	const [deleteGroup] = useDeleteGroupMutation();
	const [leaveGroup] = useLeaveGroupMutation();
	const { data: user } = useAccountQuery();

	const isCreator = useMemo(
		() => group?.creator.id === user?.id || false,
		[group?.creator.id, user?.id]
	);

	const [open, setOpen] = useState({
		invite: false,
		delete: false
	});

	const handleDialog = (key: string, state: boolean) => {
		setOpen((prev) => ({ ...prev, [key]: state }));
	};

	const handleDelete = () => {};

	const sendInvite = () => {
		const input = document.getElementById('existing-user-id');
		console.log('hello');
		if (input) {
			console.log(input.innerText);
		}
	};

	return (
		<ContextMenu.Root>
			<ContextMenu.Trigger>{children}</ContextMenu.Trigger>

			<ContextMenu.Content>
				<Dialog.Root open={open['invite']} onOpenChange={(open) => handleDialog('invite', open)}>
					<Dialog.Trigger>
						<>
							<ContextMenu.Separator />
							<ContextMenu.Item
								onClick={(e) => {
									e.preventDefault();
									handleDialog('invite', true);
								}}
							>
								Invite friends
							</ContextMenu.Item>
							<ContextMenu.Separator />
						</>
					</Dialog.Trigger>
					<Dialog.Content style={{ maxWidth: 550 }}>
						<Dialog.Title>Invite friends to {group?.name}</Dialog.Title>
						<Tabs.Root defaultValue="nonexisting">
							<Tabs.List>
								<Tabs.Trigger value="nonexisting">non-existing user</Tabs.Trigger>
								<Tabs.Trigger value="existing">existing user</Tabs.Trigger>
							</Tabs.List>

							<Tabs.Content value="existing">
								<Flex direction="column" my="3">
									<Callout.Root>
										<Callout.Icon>
											<InformationCircleIcon width="18px" />
										</Callout.Icon>
										<Callout.Text>
											Invite an existing user of the platform to your group.
										</Callout.Text>
									</Callout.Root>
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
													defaultValue=""
													placeholder="Phone, Email, Username"
												/>
												<TextField.Slot>
													<Tooltip content="Send invite!">
														<IconButton size="1" variant="soft" onClick={sendInvite}>
															<UserPlusIcon width="18px" />
														</IconButton>
													</Tooltip>
												</TextField.Slot>
											</TextField.Root>
										</label>
									</Flex>
								</Flex>
							</Tabs.Content>

							<Tabs.Content value="nonexisting">
								<Flex direction="column" my="3">
									<Callout.Root>
										<Callout.Icon>
											<InformationCircleIcon width="14px" />
										</Callout.Icon>
										<Callout.Text>
											Invite a new user to the platform and to your group.
										</Callout.Text>
									</Callout.Root>
									<Flex direction="column" gap="3" my="3">
										<label>
											<Text as="div" size="3" mb="1" weight="bold">
												Name
											</Text>
											<TextField.Input defaultValue="" placeholder="John" />
										</label>
										<label>
											<Text as="div" size="3" mb="1" weight="bold">
												Identifier
											</Text>
											<TextField.Root>
												<TextField.Slot>
													<MagnifyingGlassIcon width="18px" />
												</TextField.Slot>
												<TextField.Input defaultValue="" placeholder="Phone, Email" />
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
								</Flex>
							</Tabs.Content>
						</Tabs.Root>

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
						<ContextMenu.Item
							color="red"
							onClick={(e) => {
								e.preventDefault();
								handleDialog('delete', true);
							}}
						>
							{isCreator ? 'Delete group' : 'Leave group'}
						</ContextMenu.Item>
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
			</ContextMenu.Content>
		</ContextMenu.Root>
	);
};

export default GroupContextMenu;
