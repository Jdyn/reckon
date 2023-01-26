import { accountApi } from '@reckon/client';

const {
	useGetAccountQuery,
	useAccountSignInMutation,
	useGetSessionsQuery,
	useClearSessionsMutation,
	useAccountSignOutMutation
} = accountApi;

const HomeScreen = () => {
	const [signIn] = useAccountSignInMutation();
	const [clearSessions] = useClearSessionsMutation();
	const [signOut] = useAccountSignOutMutation();
	const { data, error } = useGetAccountQuery();
	const { data: sessions } = useGetSessionsQuery();

	return (
		<div>
			Home screen
			<button onClick={() => signIn({ email: 'test@test.com', password: 'Password123' })}>
				sign in
			</button>
			<button onClick={() => signOut()}>sign out</button>
			<div>
				{sessions &&
					sessions.tokens.map((token) => (
						<div key={token.token}>
							<h3>{token.context}</h3>
							<div>{token.token}</div>
						</div>
					))}
			</div>
			<button onClick={() => clearSessions()}>clear sessions</button>
		</div>
	);
};

export default HomeScreen;
