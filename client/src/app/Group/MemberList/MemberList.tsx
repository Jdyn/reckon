
import { useSessionQuery } from '@reckon/core';
import { ListBulletIcon } from '@radix-ui/react-icons';
import { useEvent, usePhoenix, usePresence } from 'use-phoenix';
import { useEffect } from 'react';
import { useParams } from 'react-router';

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

	const items = usePresence<{ user: User }>(id && 'group:' + id)
	console.log(items)
	return (
			<div className={styles.root} style={{ flexGrow: 1 }}>
				<h3>
					<ListBulletIcon width="24px" style={{ overflow: 'visible' }} /> Member List
				</h3>
				{/* {userList.map((user: any) => (
					<UserListCard key={user.id} user={user} online={user.onlineAt} />
				))} */}
			</div>
	);
};

export default GroupMemberList;
