import {
	BellAlertIcon,
	CheckIcon,
	EnvelopeIcon,
	PlusSmallIcon,
	XMarkIcon
} from '@heroicons/react/24/outline';
import {
	Badge,
	Button,
	Flex,
	Heading,
	IconButton,
	Popover,
	Separator,
	Text
} from '@radix-ui/themes';
import { GroupInvite, useJoinGroupMutation } from '@reckon/core';
import { useEvent } from 'use-phoenix';

import styles from './Layout.module.css';

interface InviteEvent {
	event: 'invites';
	data: { invites: GroupInvite[] };
}

function Headers() {
	const { data } = useEvent<InviteEvent>('user:notifications', 'invites');
	const [joinGroup] = useJoinGroupMutation();

	return (
		<Flex className={styles.header} grow="1" justify="between" align="center" px="4">
			<Flex>
				<Button type="button" variant="soft">
					<PlusSmallIcon width="18px" />
					<Text>Create</Text>
				</Button>
			</Flex>
			<Flex gap="3">
				<IconButton variant="soft">
					<BellAlertIcon width="18px" />
				</IconButton>
				<Popover.Root>
					<Popover.Trigger>
						<Button type="button" variant="soft">
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
	);
}

export default Headers;
