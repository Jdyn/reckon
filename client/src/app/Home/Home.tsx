import { Card, Text, Heading} from '@radix-ui/themes';
import {
	useAccountSignInMutation,
	useAccountSignOutMutation,
	useClearSessionsMutation,
	useGetAccountQuery,
	useGetSessionsQuery
} from '@reckon/core';
import { Button } from '@reckon/ui';

import styles from './Home.module.css';

const Home = () => {
	const [signIn] = useAccountSignInMutation();
	const [clearSessions] = useClearSessionsMutation();
	const [signOut] = useAccountSignOutMutation();
	const { data } = useGetAccountQuery();
	const { data: sessions } = useGetSessionsQuery();

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
