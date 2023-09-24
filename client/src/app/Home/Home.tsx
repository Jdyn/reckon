import { Card, Text, Heading} from '@radix-ui/themes';
import {
	useSignInMutation,
	useSignOutMutation,
	useClearSessionsMutation,
	useAccountQuery,
	useSessionsQuery
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
			<Heading>DEBUG ACTIONS</Heading>
			<Button onClick={() => signIn({ identifier: 'test@test.com', password: 'Password1234' })}>
				sign in
			</Button>
			<Button onClick={() => signOut()}>sign out</Button>
			<Button onClick={() => clearSessions()}>clear sessions</Button>
			<Text>{data?.user?.fullName}</Text>
			<div>
				{sessions &&
					sessions.sessions.map((token) => (
						<Card key={token.token}>
							<h3>{token.context}</h3>
							<div>{token.token}</div>
						</Card>
					))}
			</div>
		</div>
	);
};

export default Home;
