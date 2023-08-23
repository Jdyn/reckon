import { Avatar, Heading, Text } from '@radix-ui/themes';
import { User } from '@reckon/core';

import styles from './MemberCard.module.css';

interface MemberCardProps {
	user: User;
	online?: string;
}

const MemberCard = ({ user, online }: MemberCardProps) => {
	return (
		<div className={styles.root}>
			<Avatar fallback />
			<div className={styles.header}>
				<Heading className={styles.name} size="2">
					{user.username}
				</Heading>
				<div className={styles.status}>
					{online ? (
						<>
							<span className={styles.indicator} />
							<Text size="1">Online</Text>
						</>
					) : null
					// `Seen ${lastUpdated(user.updatedAt)}`
					}
				</div>
			</div>
		</div>
	);
};

export default MemberCard;
