import { Card, Flex, Heading, Text } from '@radix-ui/themes';
import {
	useAccountQuery,
	useClearSessionsMutation,
	useSessionsQuery,
	useSignInMutation,
	useSignOutMutation,
	useUserBillsQuery
} from '@reckon/core';
import { Button } from '@reckon/ui';

import BillCard from '../Bills/BillCard';
import styles from './Home.module.css';
import { useTheme } from '~/hooks/ThemeProvider';

const Home = () => {
	// const [signIn] = useSignInMutation();
	// const [clearSessions] = useClearSessionsMutation();
	// const [signOut] = useSignOutMutation();
	// const { data } = useAccountQuery();
	// const { data: sessions } = useSessionsQuery();
	const { data: bills } = useUserBillsQuery();

	return (
		<Flex direction="column" gap="2" py="3" align="center">
			{bills &&
				bills.map((bill) => (
					<BillCard key={bill.id} bill={bill} showGroup />
					// <Card key={bill.id} className={styles.card}>
					// 	<Heading size="4">{bill.group?.name}</Heading>
					// 	<Text>{bill.description}</Text>
					// </Card>
				))}
			{/* <div className={styles.buttons}>
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
			</div> */}
		</Flex>
	);
};

export default Home;
