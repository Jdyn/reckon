import { BellAlertIcon, CheckIcon, EnvelopeIcon, XMarkIcon } from '@heroicons/react/24/outline';
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
import { useState } from 'react';
import { useEvent } from 'use-phoenix';

import styles from './Layout.module.css';

function Headers() {
	const [invites, setInvites] = useState<any[]>([]);
	useEvent('user:notifications', 'invites', (response) => {
		setInvites(response.invites);
	});

	return (
		<Flex className={styles.header} grow="1" justify="end" align="center" px="4" gap="3">
			<IconButton variant="soft">
				<BellAlertIcon width="18px" />
			</IconButton>
			<Popover.Root>
				<Popover.Trigger>
					<Button type="button" variant="soft">
						{invites.length > 0 && <Badge color="red">{invites.length}</Badge>}
						<EnvelopeIcon width="18px" />
						<Text>Invites</Text>
					</Button>
				</Popover.Trigger>
				<Popover.Content sideOffset={5}>
					<Flex direction="column">
						<Heading size="3">Invites</Heading>
						{invites.length > 0 ? (
							invites.map((invite) => (
								<Flex direction="column" align="center" key={invite.id} gap="2">
									<Separator size="4" />
									<Text>
										{invite.sender.fullName} invited you to join {invite.group.name}
									</Text>
									<Flex width="100%" justify="end" align="center" gap="3">
										<IconButton variant="soft" color="red">
											<XMarkIcon width="18px" />
										</IconButton>
										<Button variant="soft" color="green">
											<CheckIcon width="18px" />
											Accept
										</Button>
									</Flex>
								</Flex>
							))
						) : (
							<Text>There are no pending invites.</Text>
						)}
					</Flex>
				</Popover.Content>
			</Popover.Root>
		</Flex>
	);
}

export default Headers;
