
import { useSessionQuery } from '@reckon/core';
import { ListBulletIcon } from '@radix-ui/react-icons';
import { useEvent, usePhoenix } from 'use-phoenix';
import { useEffect } from 'react';
import { useParams } from 'react-router';

import styles from './MemberList.module.css';

const GroupMemberList = () => {
	const { id } = useParams<{ id: string }>();
	const { data } = useSessionQuery();
	const { socket, connect } = usePhoenix();
	console.log(id)
	useEffect(() => {
		if (data?.session) {
			connect('ws://localhost:4000/socket', {
				params: { token: data.session.token }
			});
		}
	}, [connect, data?.session]);

	useEvent('group:' + id, 'presence_state', (message: any) => {
		console.log(message)
	})


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
