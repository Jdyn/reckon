import { ListBulletIcon } from '@radix-ui/react-icons';
import { Heading, Text } from '@radix-ui/themes';
import { useSessionQuery } from '@reckon/core';
import { User } from '@reckon/core';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { usePhoenix, usePresence } from 'use-phoenix';

import MemberCard from './MemberCard/MemberCard';
import styles from './MemberList.module.css';

const GroupMemberList = () => {
	const { id } = useParams<{ id: string }>();
	const { data: session } = useSessionQuery();
	const { connect } = usePhoenix();

	const presences = usePresence<{ user: User }, { onlineAt: string }>(id && 'group:' + id);

	useEffect(() => {
		if (session) {
			connect('ws://localhost:4000/socket', {
				params: { token: session.token }
			});
		}
	}, [connect, session]);

	return (
		<div className={styles.userList} style={{ flexGrow: 1 }}>
			<Heading size="4" className={styles.header}>
				<div>
					<ListBulletIcon width="24px" height="24px" style={{ overflow: 'visible' }} />
				</div>
				<Text>Members</Text>
			</Heading>
			{presences.map((presence) => (
				<MemberCard key={presence.id} user={presence.user} online={presence.metas.onlineAt} />
			))}
		</div>
	);
};

export default GroupMemberList;
