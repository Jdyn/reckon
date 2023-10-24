import { Avatar, Box, Flex, Heading, Popover, Text } from '@radix-ui/themes';
import { User } from '@reckon/core';

import styles from './MemberCard.module.css';

interface MemberCardProps {
	user: User;
	online?: string;
}

const MemberCard = ({ user, online }: MemberCardProps) => {
	return (
		<Popover.Root>
			<Popover.Trigger>
				<div className={styles.root}>
					<div className={styles.avatarContainer}>
						<Avatar fallback />
						{online && <span className={styles.indicator} />}
					</div>
					<div className={styles.header}>
						<Text weight="bold">{user.username}</Text>
						<Text size="2">{online ? 'Online' : 'Offline'}</Text>
					</div>
				</div>
			</Popover.Trigger>
			<Popover.Content style={{ width: 200 }}>
				<Flex gap="3" direction="column" align="center">
					<Avatar
						size="6"
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
