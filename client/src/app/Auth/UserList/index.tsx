import { UserGroupIcon } from '@heroicons/react/24/outline';
import { Flex, Text } from '@radix-ui/themes';
import { useGetGroupQuery, useMemberListQuery, useSessionQuery } from '@reckon/core';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { usePhoenix, usePresence } from 'use-phoenix';

import MemberCard from './UserCard';

interface UserListProps {
	title: string;
	presence: string;
}

const UserList = ({ title, presence }: UserListProps) => {
	const { id } = useParams<{ id: string }>();

	const { data: session } = useSessionQuery();
	const { data: group } = useGetGroupQuery(parseInt(id!, 10), { skip: !id });

	const { connect } = usePhoenix();

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
		<Flex grow="1" direction="column" px="3">
			{/* <Flex gap="3" px="3" asChild>
				<Text size="4" mb="3" weight="bold">
					<UserGroupIcon width="24px" height="24px" style={{ overflow: 'visible' }} />
					{title}
				</Text>
			</Flex> */}
			<Flex direction="column" gap="3">
				{userList.map((presence) => (
					<MemberCard
						key={presence.user.id}
						user={presence.user}
						online={presence.metas && presence.metas.lastSeen}
					/>
				))}
			</Flex>
		</Flex>
	);
};

export default UserList;
