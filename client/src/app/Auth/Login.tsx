import { Button, Card, Flex, Heading, Text, TextField } from '@radix-ui/themes';
import { useSignInMutation } from '@reckon/core';
import { useEffect } from 'react';
import { redirect, useNavigate } from 'react-router-dom';

const Login = () => {
	const [signIn, { isSuccess }] = useSignInMutation();
	const navigate = useNavigate();

	useEffect(() => {
		if (isSuccess) {
			navigate('/feed');
		}
	}, [isSuccess, navigate]);

	return (
		<Flex justify="center" align="center" height="100%">
			<Card size="4" style={{ width: '300px' }} variant="surface">
				<Heading mb="4">Sign in</Heading>
				<Flex justify="center" gap="5" asChild direction="column">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							signIn({ identifier: 'test@test.com', password: 'Password1234' });
						}}
					>
						<label>
							<Text weight="bold" size="2">Identifier</Text>
							<TextField.Input placeholder="Email, username, or phone" />
						</label>
						<label>
							<Text weight="bold" size="2">Password</Text>
							<TextField.Input size="2" type="password" placeholder="Enter password" />
						</label>
						<Flex direction="row" justify="end" gap="3">
							<Button type="button" variant="outline">
								Create an account
							</Button>
							<Button type="submit">Sign in</Button>
						</Flex>
					</form>
				</Flex>
			</Card>
		</Flex>
	);
};

export default Login;
