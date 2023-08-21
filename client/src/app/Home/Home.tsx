import {
	useAccountSignInMutation,
	useAccountSignOutMutation,
	useClearSessionsMutation,
	useGetAccountQuery,
	useGetSessionsQuery
} from '@reckon/core';
import { Button } from '@reckon/ui';

const Home = () => {
	const [signIn] = useAccountSignInMutation();
	const [clearSessions] = useClearSessionsMutation();
	const [signOut] = useAccountSignOutMutation();
	const { data, error } = useGetAccountQuery();
	const { data: sessions } = useGetSessionsQuery();

	return (
		<>
			<Button onClick={() => signIn({ identifier: "test@test.com", password: "Password1234"})}>sign in</Button>
			<Button>sign out</Button>
			<div>
				{sessions &&
					sessions.sessions.map((token) => (
						<div key={token.token}>
							<h3>{token.context}</h3>
							<div>{token.token}</div>
						</div>
					))}
			</div>
			<Button onClick={() => clearSessions()}>clear sessions</Button>
		</>
	);
};

export default Home;
