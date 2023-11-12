import {
	BellAlertIcon,
	CheckIcon,
	EnvelopeIcon,
	MagnifyingGlassIcon,
	PlusSmallIcon,
	XMarkIcon
} from '@heroicons/react/24/outline';
import {
	Badge,
	Button,
	Container,
	Flex,
	Heading,
	IconButton,
	Popover,
	Separator,
	Text,
	TextField
} from '@radix-ui/themes';
import { GroupInvite, useJoinGroupMutation, useSessionQuery } from '@reckon/core';
import { useEffect } from 'react';
import { useEvent, usePhoenix } from 'use-phoenix';

import { useCompose } from '../Bills/Compose/ComposeProvider';
import styles from './Layout.module.css';

interface InviteEvent {
	event: 'invites';
	data: { invites: GroupInvite[] };
}

function Headers() {
	const { data } = useEvent<InviteEvent>('user:notifications', 'invites');
	const [joinGroup] = useJoinGroupMutation();
	const { newCompose } = useCompose();

	const { data: session } = useSessionQuery();

	const { connect } = usePhoenix();

	useEffect(() => {
		if (session) {
			connect('ws://localhost:4000/socket', {
				params: { token: session.token },
				reconnectAfterMs(tries) {
					return tries * 10000;
				}
			});
		}
	}, [connect, session]);

	return (
		<div className={styles.header}>
			<Flex className={styles.headerInner} grow="1" gap="6">
				<Button
					type="button"
					variant="ghost"
					onClick={(e) => {
						e.preventDefault();
						newCompose(`${Date.now()}`);
					}}
				>
					<PlusSmallIcon width="18px" />
					<Text>Create</Text>
				</Button>
				<Container size="1">
					<TextField.Root>
						<TextField.Slot>
							<MagnifyingGlassIcon width="18px" />
						</TextField.Slot>
						<TextField.Input placeholder="search for bills, groups, users" />
					</TextField.Root>
				</Container>
				<Flex gap="5" align="center">
					<IconButton variant="ghost">
						<BellAlertIcon width="18px" />
					</IconButton>
					<Popover.Root>
						<Popover.Trigger>
							<Button type="button" variant="ghost">
								{data && data.invites.length > 0 ? (
									<Badge color="red">{data.invites.length}</Badge>
								) : (
									<EnvelopeIcon width="18px" />
								)}
								<Text>Invites</Text>
							</Button>
						</Popover.Trigger>
						<Popover.Content size="2">
							<Flex direction="column">
								<Heading size="4">Invites</Heading>
								<Separator size="4" />
								{data && data.invites.length > 0 ? (
									data.invites.map((invite) => (
										<Flex direction="row" align="center" key={invite.id} gap="4" py="3">
											<Text>
												{invite.sender.fullName} invited you to {invite.group.name}
											</Text>
											<Flex justify="end" align="center" gap="1">
												<IconButton variant="soft" color="red">
													<XMarkIcon width="18px" />
												</IconButton>
												<IconButton
													variant="soft"
													color="green"
													onClick={() => {
														joinGroup({ groupId: invite.group.id });
													}}
												>
													<CheckIcon width="18px" />
												</IconButton>
											</Flex>
										</Flex>
									))
								) : (
									<Flex py="3">You have no pending invites.</Flex>
								)}
							</Flex>
						</Popover.Content>
					</Popover.Root>
				</Flex>
			</Flex>
		</div>
	);
}

export default Headers;
