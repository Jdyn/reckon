import { UserGroupIcon } from '@heroicons/react/24/outline';
import { Button, Flex, Heading, ScrollArea, Text } from '@radix-ui/themes';
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
			<Flex className={styles.header}>
				<Flex gap="2">
					<UserGroupIcon width="24px" height="24px" style={{ overflow: 'visible' }} />
					<Text size="4" weight="bold">
						{title}
					</Text>
				</Flex>
				<Button variant="soft" size="1">
					Invite friends
				</Button>
			</Flex>
			<ScrollArea className={styles.container}>
				<Flex direction="column" gap="3" p="4" grow="1">
					<Heading className={styles.label} size="2">
						Online
					</Heading>
					{userList
						.filter((u) => u.metas?.lastSeen)
						.map((presence) => (
							<MemberCard
								key={presence.user.id}
								user={presence.user}
								online={presence.metas && presence.metas.lastSeen}
							/>
						))}
					<Heading className={styles.label} size="2">
						Offline
					</Heading>
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
			</ScrollArea>
		</div>
	);
};

export default UserList;
