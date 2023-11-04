import { DropdownMenu, Flex, Text } from '@radix-ui/themes';
import { Avatar } from '@radix-ui/themes';
import { useSessionQuery, useSignOutMutation } from '@reckon/core';
import { getInitials } from '@reckon/ui';
import { NavLink, useNavigate } from 'react-router-dom';

import styles from './Layout.module.css';

const ProfileLink = () => {
	const { data: session } = useSessionQuery();
	const [signOut] = useSignOutMutation();
	const navigate = useNavigate();

	return (
		<Flex height="9" align="center" justify="end">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<button className={styles.profileRoot}>
						<Text weight="medium">{session?.user.username}</Text>
						<Avatar
							fallback={getInitials(session?.user.fullName || '')}
							radius="full"
							size="2"
							variant="solid"
						/>
					</button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content side="bottom" size="2" className={styles.profileMenuContent}>
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
		</Flex>
	);
};

export default ProfileLink;
