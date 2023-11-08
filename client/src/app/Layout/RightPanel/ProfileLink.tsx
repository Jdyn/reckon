import { DropdownMenu, Flex, Text } from '@radix-ui/themes';
import { Avatar } from '@radix-ui/themes';
import { useSessionQuery, useSignOutMutation } from '@reckon/core';
import { getInitials } from '@reckon/ui';
import { NavLink, useNavigate } from 'react-router-dom';

import styles from './RightPanel.module.css';

const ProfileLink = () => {
	const { data: session } = useSessionQuery();
	const [signOut] = useSignOutMutation();
	const navigate = useNavigate();

	return (
		<Flex height="9" gap="2" align="center">
			<Avatar
				fallback={getInitials(session?.user.fullName || '')}
				radius="full"
				size="3"
				variant="solid"
			/>
			<Flex height="100%" align="center" width="100%">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Flex className={styles.profileTrigger} direction="column" grow="1" p="1">
							<Text weight="medium" size="2">
								{session?.user.username}
							</Text>
							<Text weight="medium" size="1" color="green">
								Online
							</Text>
						</Flex>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content side="bottom" size="2" className={styles.profileMenu}>
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
		</Flex>
	);
};

export default ProfileLink;
