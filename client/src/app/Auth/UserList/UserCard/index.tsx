import { Avatar, Box, Card, Flex, Heading, Popover, Text } from '@radix-ui/themes';
import { User } from '@reckon/core';
import { getInitials } from '@reckon/ui';

import styles from './MemberCard.module.css';

interface MemberCardProps {
	user: User;
	online?: string;
}

const MemberCard = ({ user, online }: MemberCardProps) => {
	return (
		<Popover.Root>
			<Popover.Trigger>
				<Flex className={styles.root} gap="2" align="center">
					<Avatar variant="solid" radius="full" fallback={getInitials(user.fullName)} />
					<div className={styles.header}>
						<Text weight="medium">
							{user.fullName}
						</Text>
						<Text color="gray" size="1">
							{user.username}
						</Text>
						{/* <Text color={online ? 'green' : 'gray'} size="1">{online ? 'Online' : 'Offline'}</Text> */}
					</div>
				</Flex>
			</Popover.Trigger>
			<Popover.Content style={{ minWidth: 200 }} side="left" sideOffset={-5}>
				<Flex gap="3" p="4" direction="row" align="center">
					<Avatar
						size="3"
						src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
						fallback="A"
						radius="full"
					/>
					<Box grow="1">
						<Heading size="2">{user.username}</Heading>
						<Text size="1" weight="medium">
							{user.email}
						</Text>
					</Box>
				</Flex>
			</Popover.Content>
		</Popover.Root>
	);
};

export default MemberCard;
