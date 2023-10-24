import { ListBulletIcon } from '@radix-ui/react-icons';
import { Flex, Heading, Text } from '@radix-ui/themes';
import { useMemberListQuery, useSessionQuery } from '@reckon/core';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { usePhoenix, usePresence } from 'use-phoenix';

import MemberCard from './UserCard';
import styles from './UserCard.module.css';

interface UserListProps {
	title: string;
	presence: string;
}

const UserList = ({ title, presence }: UserListProps) => {
	const { id } = useParams<{ id: string }>();

	const { data: session } = useSessionQuery();
	const { data: members } = useMemberListQuery(id, { skip: !id });

	const { connect } = usePhoenix();

	const presences = usePresence<void, { lastSeen: string }>(presence);

	const userList = useMemo(() => {
		if (members) {
			return members.map((member) => {
				const presence = presences.find((p) => parseInt(p.id, 10) === member.id);
				return { user: member, ...presence };
			});
		}
		return [];
	}, [members, presences]);

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
		<Flex className={styles.userList} grow="1">
			<Heading size="4" mb="3" className={styles.header}>
				<div>
					<ListBulletIcon width="24px" height="24px" style={{ overflow: 'visible' }} />
				</div>
				{title}
			</Heading>
			{userList.map((presence) => (
				<MemberCard key={presence.user.id} user={presence.user} online={presence.metas && presence.metas.lastSeen} />
			))}
		</Flex>
	);
};

export default UserList;
