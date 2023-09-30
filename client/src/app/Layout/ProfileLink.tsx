import { DropdownMenu, Heading, Text } from '@radix-ui/themes';
import { useAccountQuery, useSignOutMutation } from '@reckon/core';
import { Avatar } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';

import styles from './Layout.module.css';
import { getInitials } from '@reckon/ui';

const ProfileLink = () => {
	const { data: user } = useAccountQuery();
	const [signOut] = useSignOutMutation();
	const navigate = useNavigate();

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<div className={styles.profileRoot}>
					<Avatar fallback={getInitials(user?.fullName || '')} radius="full" size="3" variant="solid" />
					<Heading size="2">{user?.username}</Heading>
				</div>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content size="2" className={styles.profileMenuContent}>
				<DropdownMenu.Item>Profile</DropdownMenu.Item>
				<DropdownMenu.Item>Settings</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					color="red"
					onClick={() => {
						signOut();
						navigate('/login');
					}}
				>
					Log out
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
};

export default ProfileLink;
