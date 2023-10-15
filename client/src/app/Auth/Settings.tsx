import { Container, Flex, Grid, Heading, Separator, Text } from '@radix-ui/themes';
import { useSessionsQuery } from '@reckon/core';

import styles from './Settings.module.css';
import { Avatar } from '@reckon/ui';

const Settings = () => {
	const { data: sessions } = useSessionsQuery();

	return (
		<Flex direction="column">
			<Heading m="3">Account</Heading>
			<Separator size="4" />
			<div className={styles.root}>
				<div className={styles.container}>
					<div className={styles.session}>
						<Heading size="4">Sessions</Heading>
						<Separator size="4" />
						{sessions &&
							sessions.map((session) => (
								<Flex key={session.token} direction="column">
									<Heading size="3" as="h4">
										{session.context}
									</Heading>
									<Text>{session.token}</Text>
								</Flex>
							))}
					</div>
					<Flex className={styles.menu}>
					</Flex>
				</div>
			</div>
		</Flex>
	);
};

export default Settings;
