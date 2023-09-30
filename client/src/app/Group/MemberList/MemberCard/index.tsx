import {
	Avatar,
	Box,
	Button,
	Checkbox,
	Flex,
	Heading,
	Popover,
	Text,
	TextArea
} from '@radix-ui/themes';
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
						<span className={styles.indicator} />
					</div>
					<div className={styles.header}>
						<Heading className={styles.name} size="2">
							{user.username}
						</Heading>
						<div className={styles.status}>
							{
								online ? (
									<>
										<Text size="1">Online</Text>
									</>
								) : null
								// `Seen ${lastUpdated(user.updatedAt)}`
							}
						</div>
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
