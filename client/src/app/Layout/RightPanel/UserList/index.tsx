import {
	MagnifyingGlassIcon,
	UserGroupIcon,
	UserMinusIcon,
	UserPlusIcon
} from '@heroicons/react/24/outline';
import { Button, Flex, Heading, IconButton, ScrollArea, Text, TextField } from '@radix-ui/themes';
import { useGetGroupQuery } from '@reckon/core';
import { useMemo } from 'react';
import { useParams } from 'react-router';
import { useMatch } from 'react-router-dom';
import { usePresence } from 'use-phoenix';

import MemberCard from './UserCard';
import styles from './UserList.module.css';

const UserList = () => {
	const { id } = useParams<{ id: string }>();
	const match = useMatch({ path: '/g/:id', end: false });

	const title = match ? 'Members' : 'Friends';
	const presence = match ? `group:${id}` : '';

	const { data: group } = useGetGroupQuery(parseInt(id!, 10), { skip: !id });

	const presences = usePresence<void, { lastSeen: string }>(presence);

	const userList = useMemo(() => {
		if (group?.members) {
			return group.members.map((member) => {
				const presence = presences.find((p) => parseInt(p.id, 10) === member.id);
				return { user: member, ...presence };
			});
		}
		return [];
	}, [group, presences]);

	return (
		<div className={styles.root}>
			<Flex gap="2">
				<IconButton type="button" variant="soft" title="add friend">
					<UserPlusIcon width="18px" />
				</IconButton>
				<IconButton type="button" variant="soft" title="remove friend">
					<UserMinusIcon width="18px" />
				</IconButton>
				<TextField.Root>
					<TextField.Input variant="soft" />
					<TextField.Slot>
						<MagnifyingGlassIcon width="18px" />
					</TextField.Slot>
				</TextField.Root>
			</Flex>
			{/* <ScrollArea className={styles.container}> */}
			<Flex direction="column" grow="1" gap="2">
				<Heading className={styles.label} size="2">
					Online
				</Heading>
				<Flex direction="column">
					{userList
						.filter((u) => u.metas?.lastSeen)
						.map((presence) => (
							<MemberCard
								key={presence.user.id}
								user={presence.user}
								online={presence.metas && presence.metas.lastSeen}
							/>
						))}
				</Flex>
				<Heading className={styles.label} size="2">
					Offline
				</Heading>
				<Flex direction="column">
					{userList
						.filter((u) => !u.metas?.lastSeen)
						.map((presence) => (
							<MemberCard
								key={presence.user.id}
								user={presence.user}
								online={presence.metas && presence.metas.lastSeen}
							/>
						))}
				</Flex>
			</Flex>
			{/* </ScrollArea> */}
			<Button variant="soft">Chats</Button>
		</div>
	);
};

export default UserList;
