import { ListBulletIcon } from '@radix-ui/react-icons';
import { useSessionQuery } from '@reckon/core';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useEvent, usePhoenix, usePresence } from 'use-phoenix';

import styles from './MemberList.module.css';

import { User } from '@reckon/core/src/services/account/types';

const GroupMemberList = () => {
	const { id } = useParams<{ id: string }>();
	const { data } = useSessionQuery();
	const { socket, connect } = usePhoenix();

	useEffect(() => {
		if (data?.session) {
			connect('ws://localhost:4000/socket', {
				params: { token: data.session.token }
			});
		}
	}, [connect, data?.session]);

	const presences = usePresence<{ user: User }>(id && 'group:' + id);

	return (
		<div className={styles.root} style={{ flexGrow: 1 }}>
			<h3>
				<ListBulletIcon width="24px" style={{ overflow: 'visible' }} /> Member List
			</h3>
			{presences.map((presence) => (
				<div key={presence.id}>{presence.user.fullName}</div>
			))}
		</div>
	);
};

export default GroupMemberList;
