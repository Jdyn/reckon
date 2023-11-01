import { InformationCircleIcon, MagnifyingGlassIcon, UsersIcon } from '@heroicons/react/24/outline';
import { ExitIcon } from '@radix-ui/react-icons';
import {
	AlertDialog,
	Button,
	Callout,
	ContextMenu,
	Dialog,
	Flex,
	Tabs,
	Text,
	TextField
} from '@radix-ui/themes';
import {
	useDeleteGroupMutation,
	useGetGroupQuery,
	useInviteUserMutation,
	useLeaveGroupMutation,
	useSessionQuery
} from '@reckon/core';
import { ReactNode, useMemo, useState } from 'react';
import Error from '~/components/Error';

interface GroupContextMenuProps {
	children: ReactNode;
	groupId: number;
}

const GroupContextMenu = ({ children, groupId }: GroupContextMenuProps) => {
	const { data: group } = useGetGroupQuery(groupId, { skip: !groupId });
	const { data: session } = useSessionQuery();

	const [deleteGroup] = useDeleteGroupMutation();
	const [leaveGroup] = useLeaveGroupMutation();
	const [inviteUser, { isSuccess, error }] = useInviteUserMutation();
	const [identifier, setIdentifer] = useState('');

	const isCreator = useMemo(
		() => group?.creator.id === session?.user?.id || false,
		[group?.creator.id, session?.user?.id]
	);

	const [open, setOpen] = useState({
		invite: false,
		delete: false
	});

	const handleDialog = (key: string, state: boolean) => {
		setOpen((prev) => ({ ...prev, [key]: state }));
	};

	const handleDelete = () => {};

	const handleInvite = () => {
		if (identifier && group?.id) {
			inviteUser({
				groupId: group.id,
				body: {
					recipient: {
						identifier
					}
				}
			});
		}
	};

	return (
		<ContextMenu.Root>
			<ContextMenu.Trigger>{children}</ContextMenu.Trigger>

			<ContextMenu.Content style={{ width: '175px' }}>
				<Dialog.Root open={open['invite']} onOpenChange={(open) => handleDialog('invite', open)}>
					<Dialog.Trigger>
						<>
							<ContextMenu.Separator />
							<ContextMenu.Item
								onClick={(e) => {
									e.preventDefault();
									handleDialog('invite', true);
								}}>
								Invite friends
								<UsersIcon width="18px" />
							</ContextMenu.Item>
							<ContextMenu.Separator />
						</>
					</Dialog.Trigger>
					<Dialog.Content style={{ maxWidth: 550 }}>
						<Dialog.Title>Invite friends to {group?.name}</Dialog.Title>
						<Tabs.Root defaultValue="existing">
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
													placeholder="Phone, Email, Username"
													value={identifier}
													onChange={(e) => setIdentifer(e.target.value)}
												/>
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
											<TextField.Input value={identifier} placeholder="John" />
										</label>
										<label>
											<Text as="div" size="3" mb="1" weight="bold">
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

						{isSuccess && (
							<Callout.Root>
								<Callout.Text>Invitation sent!</Callout.Text>
							</Callout.Root>
						)}

						{/* {error && (
							<Callout.Root>
								<Callout.Text>{error.data.errors}</Callout.Text>
							</Callout.Root>
						)} */}

						<Flex gap="3" mt="4" justify="end">
							<Dialog.Close>
								<Button variant="soft" color="gray">
									cancel
								</Button>
							</Dialog.Close>
							<Button variant="soft" color="green" onClick={handleInvite}>
								Invite
							</Button>
						</Flex>
					</Dialog.Content>
				</Dialog.Root>

				<AlertDialog.Root
					open={open['delete']}
					onOpenChange={(open) => handleDialog('delete', open)}>
					<AlertDialog.Trigger>
						<ContextMenu.Item
							color="red"
							onClick={(e) => {
								e.preventDefault();
								handleDialog('delete', true);
							}}>
							{isCreator ? 'Delete group' : 'Leave group'}
							<ExitIcon width="18px" />
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
									}}>
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
