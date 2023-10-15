import { DropdownMenu, Heading, Text } from '@radix-ui/themes';
import { Avatar } from '@radix-ui/themes';
import { useAccountQuery, useSignOutMutation } from '@reckon/core';
import { getInitials } from '@reckon/ui';
import { NavLink, useNavigate } from 'react-router-dom';

import styles from './Layout.module.css';

const ProfileLink = () => {
	const { data: user } = useAccountQuery();
	const [signOut] = useSignOutMutation();
	const navigate = useNavigate();

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<button className={styles.profileRoot}>
					<Avatar
						fallback={getInitials(user?.fullName || '')}
						radius="full"
						size="2"
						variant="solid"
					/>
					<Heading size="2">{user?.username}</Heading>
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content size="2" className={styles.profileMenuContent}>
				<DropdownMenu.Item>Profile</DropdownMenu.Item>
				<DropdownMenu.Item asChild>
					<NavLink to="settings">
						<Text>Settings</Text>
					</NavLink>
				</DropdownMenu.Item>
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
