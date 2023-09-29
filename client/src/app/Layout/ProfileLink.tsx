import { DropdownMenu, Text } from '@radix-ui/themes';
import { useAccountQuery, useSignOutMutation } from '@reckon/core';
import { Avatar } from '@reckon/ui';
import { useNavigate } from 'react-router-dom';

import styles from './Layout.module.css';

const ProfileLink = () => {
	const { data: user } = useAccountQuery();
	const [signOut] = useSignOutMutation();
	const navigate = useNavigate();

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<div className={styles.profileRoot}>
					<Avatar text={user?.fullName || ''} />
					<Text size="4">{user?.fullName}</Text>
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
