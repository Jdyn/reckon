import { Card, Heading, Text } from '@radix-ui/themes';
import {
	useAccountQuery,
	useClearSessionsMutation,
	useSessionsQuery,
	useSignInMutation,
	useSignOutMutation
} from '@reckon/core';
import { Button } from '@reckon/ui';

import styles from './Home.module.css';

const Home = () => {
	const [signIn] = useSignInMutation();
	const [clearSessions] = useClearSessionsMutation();
	const [signOut] = useSignOutMutation();
	const { data } = useAccountQuery();
	const { data: sessions } = useSessionsQuery();

	return (
		<div className={styles.root}>
			<div className={styles.buttons}>
				<Button onClick={() => signIn({ identifier: 'test@test.com', password: 'Password1234' })}>
					sign in
				</Button>
				<Button onClick={() => signOut()}>sign out</Button>
				<Button onClick={() => clearSessions()}>clear sessions</Button>
			</div>
			<div className={styles.container}>
				{sessions &&
					sessions.map((token) => (
						<Button key={token.token} variant="surface">
							<Heading size="4">{token.context}</Heading>
							<Text>{token.token}</Text>
						</Button>
					))}
			</div>
		</div>
	);
};

export default Home;
